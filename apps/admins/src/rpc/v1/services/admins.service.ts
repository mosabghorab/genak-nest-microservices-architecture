import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Admin, AdminStatus, AdminUpdatePasswordPayloadDto, AdminUpdateProfilePayloadDto, FindOneByEmailPayloadDto, FindOneByIdPayloadDto, PermissionGroup, SearchPayloadDto } from '@app/common';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one by email.
  findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email: findOneByEmailPayloadDto.email },
      relations: findOneByEmailPayloadDto.relations,
    });
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]> {
    return this.adminRepository.find({
      where: { name: ILike(`%${searchPayloadDto.searchQuery}%`) },
    });
  }

  // find all by permission group.
  findAllByPermissionGroup(permissionGroup: PermissionGroup): Promise<Admin[]> {
    return this.adminRepository.find({
      where: {
        status: AdminStatus.ACTIVE,
        adminsRoles: {
          role: {
            rolesPermissions: {
              permission: {
                group: permissionGroup,
              },
            },
          },
        },
      },
    });
  }

  // update password.
  async updatePassword(adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin> {
    const admin: Admin = await this.findOneById(
      new FindOneByIdPayloadDto<Admin>({
        id: adminUpdatePasswordPayloadDto.adminId,
      }),
    );
    admin.password = adminUpdatePasswordPayloadDto.newPassword;
    return this.adminRepository.save(admin);
  }

  // update profile.
  async updateProfile(adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin> {
    const admin: Admin = await this.findOneById(
      new FindOneByIdPayloadDto<Admin>({
        id: adminUpdateProfilePayloadDto.adminId,
      }),
    );
    Object.assign(admin, adminUpdateProfilePayloadDto);
    return this.adminRepository.save(admin);
  }

  // count.
  count(): Promise<number> {
    return this.adminRepository.count();
  }
}
