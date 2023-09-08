import { Controller } from '@nestjs/common';
import { Admin, AdminsMicroserviceConstants, AdminUpdatePasswordDto, AdminUpdateProfileDto, FindOneByEmailDto, FindOneByIdDto, PermissionGroup } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminsService } from '../services/admins.service';

const VERSION = '1';

@Controller()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneByEmail(findOneByEmailDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ALL_BY_PERMISSION_GROUP_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAllByPermissionGroup(@Payload() permissionGroup: PermissionGroup): Promise<Admin[]> {
    return this.adminsService.findAllByPermissionGroup(permissionGroup);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updatePassword(@Payload() adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin> {
    return this.adminsService.updatePassword(adminUpdatePasswordDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@Payload() adminUpdateProfileDto: AdminUpdateProfileDto): Promise<Admin> {
    return this.adminsService.updateProfile(adminUpdateProfileDto);
  }

  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(): Promise<number> {
    return this.adminsService.count();
  }
}
