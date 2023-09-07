import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminUpdatePasswordDto, AdminUpdateProfileDto, FindOneByEmailDto, FindOneByIdDto } from '@app/common';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one by email.
  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null> {
    return this.adminRepository.findOne({
      where: { email: findOneByEmailDto.email },
      relations: findOneByEmailDto.relations,
    });
  }

  // update password.
  async updatePassword(adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin> {
    const admin: Admin = await this.findOneById(<FindOneByIdDto<Admin>>{
      id: adminUpdatePasswordDto.adminId,
    });
    admin.password = adminUpdatePasswordDto.newPassword;
    return this.adminRepository.save(admin);
  }

  // update profile.
  async updateProfile(adminUpdateProfileDto: AdminUpdateProfileDto): Promise<Admin> {
    const admin: Admin = await this.findOneById(<FindOneByIdDto<Admin>>{
      id: adminUpdateProfileDto.adminId,
    });
    Object.assign(admin, adminUpdateProfileDto);
    return this.adminRepository.save(admin);
  }
}
