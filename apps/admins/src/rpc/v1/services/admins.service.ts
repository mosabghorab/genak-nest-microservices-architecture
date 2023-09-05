import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin, AdminUpdatePasswordDto, FindOneByIdDto } from '@app/common';
import { FindOneByEmailDto } from '@app/common/dtos/find-one-by-email.dto';

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
}
