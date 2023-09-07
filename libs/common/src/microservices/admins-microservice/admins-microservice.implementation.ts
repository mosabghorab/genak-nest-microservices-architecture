import { Admin, AdminsMicroserviceConstants, AdminUpdatePasswordDto, AdminUpdateProfileDto, FindOneByEmailDto, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { IAdminsMicroservice } from '@app/common/microservices/admins-microservice/admins-microservice.interface';
import { FindOneOrFailByEmailDto } from '@app/common/dtos/find-one-or-fail-by-email.dto';
import { plainToInstance } from 'class-transformer';

export class AdminsMicroserviceImpl implements IAdminsMicroservice {
  constructor(private readonly adminsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, FindOneByIdDto<Admin>>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin> {
    const admin: Admin = await firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, FindOneByIdDto<Admin>>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByIdDto<Admin>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Admin not found.');
    }
    return plainToInstance(Admin, admin);
  }

  // find one by email.
  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, FindOneByEmailDto<Admin>>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByEmailDto,
      ),
    );
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin> {
    const admin: Admin = await firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, FindOneByEmailDto<Admin>>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByEmailDto<Admin>>{
          email: findOneOrFailByEmailDto.email,
          relations: findOneOrFailByEmailDto.relations,
        },
      ),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByEmailDto.failureMessage || 'Admin not found.');
    }
    return plainToInstance(Admin, admin);
  }

  // update password.
  updatePassword(adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, AdminUpdatePasswordDto>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN}/v${this.version}`,
        },
        adminUpdatePasswordDto,
      ),
    );
  }

  // update profile.
  updateProfile(adminUpdateProfileDto: AdminUpdateProfileDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, AdminUpdateProfileDto>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        adminUpdateProfileDto,
      ),
    );
  }
}
