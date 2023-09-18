import { Inject, Injectable } from '@nestjs/common';
import { Admin, AdminsMicroserviceConnection, AdminsMicroserviceConstants, AdminUpdateProfilePayloadDto, AuthedUser, FindOneOrFailByIdPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';
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
  async update(authedUser: AuthedUser, updateProfileRequestDto: UpdateProfileRequestDto): Promise<Admin> {
    await this.adminProfileValidation.validateUpdate(authedUser, updateProfileRequestDto);
    return this.adminsMicroserviceConnection.adminsServiceImpl.updateProfile(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new AdminUpdateProfilePayloadDto({
        adminId: authedUser.id,
        ...updateProfileRequestDto,
      }),
    );
  }

  // find.
  find(authedUser: AuthedUser): Promise<Admin> {
    return this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Admin>({
        id: authedUser.id,
        relations: { adminsRoles: { role: { rolesPermissions: { permission: true } } } },
      }),
    );
  }
}
