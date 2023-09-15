import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminsRoles, FindOneByEmailPayloadDto, FindOneByIdPayloadDto, FindOneOrFailByEmailPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { AdminsRolesService } from './admins-roles.service';
import { FindAllAdminsRequestDto } from '../dtos/find-all-admins-request.dto';
import { CreateAdminRequestDto } from '../dtos/create-admin-request.dto';
import { UpdateAdminRequestDto } from '../dtos/update-admin-request.dto';
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneById(
      new FindOneByIdPayloadDto<Admin>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find one by email.
  findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email: findOneByEmailPayloadDto.email },
      relations: findOneByEmailPayloadDto.relations,
    });
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailPayloadDto: FindOneOrFailByEmailPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneByEmail(
      new FindOneOrFailByEmailPayloadDto<Admin>({
        email: findOneOrFailByEmailPayloadDto.email,
        relations: findOneOrFailByEmailPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new BadRequestException(findOneOrFailByEmailPayloadDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find all.
  async findAll(findAllAdminsRequestDto: FindAllAdminsRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Admin[];
        currentPage: number;
      }
    | { total: number; data: Admin[] }
  > {
    const offset: number = (findAllAdminsRequestDto.page - 1) * findAllAdminsRequestDto.limit;
    const [admins, count]: [Admin[], number] = await this.adminRepository.findAndCount({
      relations: {
        adminsRoles: { role: true },
      },
      skip: findAllAdminsRequestDto.paginationEnable ? offset : null,
      take: findAllAdminsRequestDto.paginationEnable ? findAllAdminsRequestDto.limit : null,
    });
    return findAllAdminsRequestDto.paginationEnable
      ? {
          perPage: findAllAdminsRequestDto.limit,
          currentPage: findAllAdminsRequestDto.page,
          lastPage: Math.ceil(count / findAllAdminsRequestDto.limit),
          total: count,
          data: admins,
        }
      : {
          total: count,
          data: admins,
        };
  }

  // create.
  async create(createAdminRequestDto: CreateAdminRequestDto): Promise<Admin> {
    const adminByEmail: Admin = await this.findOneByEmail(
      new FindOneByEmailPayloadDto<Admin>({
        email: createAdminRequestDto.email,
      }),
    );
    if (adminByEmail) {
      throw new BadRequestException('Email is already exists.');
    }
    const savedAdmin = await this.adminRepository.save(await this.adminRepository.create(createAdminRequestDto));
    savedAdmin.adminsRoles = createAdminRequestDto.rolesIds.map(
      (e: number) =>
        <AdminsRoles>{
          adminId: savedAdmin.id,
          roleId: e,
        },
    );
    return await this.adminRepository.save(savedAdmin);
  }

  // update.
  async update(adminId: number, updateAdminRequestDto: UpdateAdminRequestDto): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id: adminId,
        relations: { adminsRoles: true },
      }),
    );
    if (updateAdminRequestDto.email) {
      const adminByEmail: Admin = await this.findOneByEmail(
        new FindOneByEmailPayloadDto<Admin>({
          email: updateAdminRequestDto.email,
        }),
      );
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
    if (updateAdminRequestDto.rolesIds) {
      await this.adminsRolesService.removeAllByAdminId(adminId);
      admin.adminsRoles = updateAdminRequestDto.rolesIds.map(
        (e: number) =>
          <AdminsRoles>{
            adminId: admin.id,
            roleId: e,
          },
      );
    }
    Object.assign(admin, updateAdminRequestDto);
    return this.adminRepository.save(admin);
  }

  // remove.
  async remove(id: number): Promise<Admin> {
    const admin: Admin = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id,
      }),
    );
    return this.adminRepository.remove(admin);
  }

  // export all.
  async exportAll(findAllAdminsRequestDto: FindAllAdminsRequestDto): Promise<StreamableFile> {
    const { data }: { data: Admin[] } = await this.findAll(findAllAdminsRequestDto);
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
