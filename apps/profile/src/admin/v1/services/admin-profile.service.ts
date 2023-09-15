import { Inject, Injectable } from '@nestjs/common';
import { Admin, AdminsMicroserviceConnection, AdminsMicroserviceConstants, AdminUpdateProfilePayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../../auth/src/constants';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';
import { AdminProfileValidation } from '../validations/admin-profile.validation';

@Injectable()
export class AdminProfileService {
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;

  constructor(private readonly adminProfileValidation: AdminProfileValidation, @Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy) {
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // update.
  async update(adminId: number, updateProfileRequestDto: UpdateProfileRequestDto): Promise<Admin> {
    await this.adminProfileValidation.validateUpdate(adminId, updateProfileRequestDto);
    return this.adminsMicroserviceConnection.adminsServiceImpl.updateProfile(
      new AdminUpdateProfilePayloadDto({
        adminId,
        ...updateProfileRequestDto,
      }),
    );
  }

  // find.
  find(adminId: number): Promise<Admin> {
    return this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Admin>({
        id: adminId,
        relations: { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
      }),
    );
  }
}
