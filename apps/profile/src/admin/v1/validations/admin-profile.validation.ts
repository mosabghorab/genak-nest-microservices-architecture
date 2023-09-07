import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Admin, AdminsMicroserviceConstants, AdminsMicroserviceImpl, FindOneByEmailDto, FindOneOrFailByIdDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class AdminProfileValidation {
  private readonly adminsMicroserviceImpl: AdminsMicroserviceImpl;

  constructor(@Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy) {
    this.adminsMicroserviceImpl = new AdminsMicroserviceImpl(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(adminId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    await this.adminsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Admin>>{
      id: adminId,
    });
    if (updateProfileDto.email) {
      const adminByEmail: Admin = await this.adminsMicroserviceImpl.findOneByEmail(<FindOneByEmailDto<Admin>>{
        email: updateProfileDto.email,
      });
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
  }
}
