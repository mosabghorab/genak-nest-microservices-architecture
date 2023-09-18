import { Controller, UseGuards } from '@nestjs/common';
import {
  Admin,
  AdminsMicroserviceConstants,
  AdminUpdatePasswordPayloadDto,
  AdminUpdateProfilePayloadDto,
  AllowFor,
  AuthGuard,
  FindOneByEmailPayloadDto,
  FindOneByIdPayloadDto,
  PermissionGroup,
  Public,
  SearchPayloadDto,
  SkipAdminRoles,
  UserType,
} from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminsService } from '../services/admins.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneById(findOneByIdPayloadDto);
  }

  @Public()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByEmail(@Payload('findOneByEmailPayloadDto') findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null> {
    return this.adminsService.findOneByEmail(findOneByEmailPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${VERSION}`,
  })
  searchByName(@Payload('searchPayloadDto') searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]> {
    return this.adminsService.searchByName(searchPayloadDto);
  }

  @AllowFor(UserType.ADMIN, UserType.CUSTOMER, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ALL_BY_PERMISSION_GROUP_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAllByPermissionGroup(@Payload('permissionGroup') permissionGroup: PermissionGroup): Promise<Admin[]> {
    return this.adminsService.findAllByPermissionGroup(permissionGroup);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updatePassword(@Payload('adminUpdatePasswordPayloadDto') adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin> {
    return this.adminsService.updatePassword(adminUpdatePasswordPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@Payload('adminUpdateProfilePayloadDto') adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin> {
    return this.adminsService.updateProfile(adminUpdateProfilePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(): Promise<number> {
    return this.adminsService.count();
  }
}
