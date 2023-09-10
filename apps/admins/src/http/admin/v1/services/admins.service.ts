import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminsRoles, FindOneByEmailDto, FindOneByIdDto, FindOneOrFailByEmailDto, FindOneOrFailByIdDto } from '@app/common';
import { AdminsRolesService } from './admins-roles.service';
import { FindAllAdminsDto } from '../dtos/find-all-admins.dto';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { Workbook, Worksheet } from 'exceljs';
import * as fsExtra from 'fs-extra';
import { createReadStream } from 'fs';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly adminsRolesService: AdminsRolesService,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneById(<FindOneByIdDto<Admin>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!admin) {
      throw new BadRequestException(findOneOrFailByIdDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find one by email.
  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email: findOneByEmailDto.email },
      relations: findOneByEmailDto.relations,
    });
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneByEmail(<FindOneOrFailByEmailDto<Admin>>{
      email: findOneOrFailByEmailDto.email,
      relations: findOneOrFailByEmailDto.relations,
    });
    if (!admin) {
      throw new BadRequestException(findOneOrFailByEmailDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find all.
  async findAll(findAllAdminsDto: FindAllAdminsDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Admin[];
        currentPage: number;
      }
    | { total: number; data: Admin[] }
  > {
    const offset: number = (findAllAdminsDto.page - 1) * findAllAdminsDto.limit;
    const [admins, count]: [Admin[], number] = await this.adminRepository.findAndCount({
      relations: {
        adminsRoles: { role: true },
      },
      skip: findAllAdminsDto.paginationEnable ? offset : null,
      take: findAllAdminsDto.paginationEnable ? findAllAdminsDto.limit : null,
    });
    return findAllAdminsDto.paginationEnable
      ? {
          perPage: findAllAdminsDto.limit,
          currentPage: findAllAdminsDto.page,
          lastPage: Math.ceil(count / findAllAdminsDto.limit),
          total: count,
          data: admins,
        }
      : {
          total: count,
          data: admins,
        };
  }

  // create.
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const adminByEmail = await this.findOneByEmail(<FindOneByEmailDto<Admin>>{
      email: createAdminDto.email,
    });
    if (adminByEmail) {
      throw new BadRequestException('Email is already exists.');
    }
    const savedAdmin = await this.adminRepository.save(await this.adminRepository.create(createAdminDto));
    savedAdmin.adminsRoles = createAdminDto.rolesIds.map(
      (e: number) =>
        <AdminsRoles>{
          adminId: savedAdmin.id,
          roleId: e,
        },
    );
    return await this.adminRepository.save(savedAdmin);
  }

  // update.
  async update(adminId: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(<FindOneOrFailByIdDto<Admin>>{
      id: adminId,
      relations: { adminsRoles: true },
    });
    if (updateAdminDto.email) {
      const adminByEmail: Admin = await this.findOneByEmail(<FindOneByEmailDto<Admin>>{
        email: updateAdminDto.email,
      });
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    if (updateAdminDto.rolesIds) {
      await this.adminsRolesService.removeAllByAdminId(adminId);
      admin.adminsRoles = updateAdminDto.rolesIds.map(
        (e: number) =>
          <AdminsRoles>{
            adminId: admin.id,
            roleId: e,
          },
      );
    }
    Object.assign(admin, updateAdminDto);
    return this.adminRepository.save(admin);
  }

  // remove.
  async remove(id: number): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(<FindOneOrFailByIdDto<Admin>>{
      id,
    });
    return this.adminRepository.remove(admin);
  }

  // export all.
  async exportAll(findAllAdminsDto: FindAllAdminsDto): Promise<StreamableFile> {
    const { data }: { data: Admin[] } = await this.findAll(findAllAdminsDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('مسؤولين النظام');
    // add headers.
    worksheet.addRow(['اسم المسؤول', 'البريد الالكتروني', 'الحالة', 'تاريخ الانشاء']);
    // add data rows.
    data.forEach((admin: Admin): void => {
      worksheet.addRow([admin.name, admin.email, admin.status, admin.createdAt.toDateString()]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }
}
