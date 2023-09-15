import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Admin, AdminsMicroserviceConnection, AdminsMicroserviceConstants, FindOneByEmailPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

@Injectable()
export class AdminProfileValidation {
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;

  constructor(@Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy) {
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(adminId: number, updateProfileDto: UpdateProfileRequestDto): Promise<void> {
    await this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id: adminId,
      }),
    );
    if (updateProfileDto.email) {
      const adminByEmail: Admin = await this.adminsMicroserviceConnection.adminsServiceImpl.findOneByEmail(
        new FindOneByEmailPayloadDto<Admin>({
          email: updateProfileDto.email,
        }),
      );
      if (adminByEmail) {
        throw new BadRequestException('Email is already exists.');
      }
    }
  }
}
