import { Inject, Injectable } from '@nestjs/common';
import { Admin, AdminsMicroserviceConnection, AdminsMicroserviceConstants, AdminUpdateProfileDto, FindOneOrFailByIdDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../../auth/src/constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AdminProfileValidation } from '../validations/admin-profile.validation';

@Injectable()
export class AdminProfileService {
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;

  constructor(private readonly adminProfileValidation: AdminProfileValidation, @Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy) {
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // update.
  async update(adminId: number, updateProfileDto: UpdateProfileDto): Promise<Admin> {
    await this.adminProfileValidation.validateUpdate(adminId, updateProfileDto);
    return this.adminsMicroserviceConnection.adminsServiceImpl.updateProfile(<AdminUpdateProfileDto>{
      adminId,
      ...updateProfileDto,
    });
  }

  // find.
  find(adminId: number): Promise<Admin> {
    return this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Admin>>{
      id: adminId,
      relations: { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
    });
  }
}
