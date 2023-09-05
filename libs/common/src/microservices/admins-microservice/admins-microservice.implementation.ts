import { Admin, AdminsMicroserviceConstants, AdminUpdatePasswordDto, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { IAdminsMicroservice } from '@app/common/microservices/admins-microservice/admins-microservice.interface';
import { FindOneByEmailDto } from '@app/common/dtos/find-one-by-email.dto';
import { FindOneOrFailByEmailDto } from '@app/common/dtos/find-one-or-fail-by-email.dto';
import { plainToInstance } from 'class-transformer';

export class AdminsMicroserviceImpl implements IAdminsMicroservice {
  constructor(private readonly adminsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send(
        {
          cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin> {
    const admin: Admin = await firstValueFrom<Admin>(
      this.adminsMicroservice.send(
        {
          cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
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
      this.adminsMicroservice.send(
        {
          cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_EMAIL}/v${this.version}`,
        },
        findOneByEmailDto,
      ),
    );
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin> {
    const admin: Admin = await firstValueFrom<Admin>(
      this.adminsMicroservice.send(
        {
          cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_EMAIL}/v${this.version}`,
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
      this.adminsMicroservice.send(
        {
          cmd: `${AdminsMicroserviceConstants.MICROSERVICE_FUNCTION_UPDATE_PASSWORD}/v${this.version}`,
        },
        adminUpdatePasswordDto,
      ),
    );
  }
}
