import {
  Admin,
  AdminsMicroserviceConstants,
  AdminUpdatePasswordPayloadDto,
  AdminUpdateProfilePayloadDto,
  FindOneByEmailPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrFailByEmailPayloadDto,
  FindOneOrFailByIdPayloadDto,
  IAdminsService,
  PermissionGroup,
  SearchPayloadDto,
} from '@app/common';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientProxy } from '@nestjs/microservices';

export class AdminsServiceImpl implements IAdminsService {
  constructor(private readonly adminsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin> }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneById(
      new FindOneByIdPayloadDto<Admin>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Admin not found.');
    }
    return plainToInstance(Admin, admin);
  }

  // find one by email.
  findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, { findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin> }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByEmailPayloadDto },
      ),
    );
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailPayloadDto: FindOneOrFailByEmailPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneByEmail(
      new FindOneByEmailPayloadDto<Admin>({
        email: findOneOrFailByEmailPayloadDto.email,
        relations: findOneOrFailByEmailPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByEmailPayloadDto.failureMessage || 'Admin not found.');
    }
    return plainToInstance(Admin, admin);
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]> {
    return firstValueFrom<Admin[]>(
      this.adminsMicroservice.send<Admin[], { searchPayloadDto: SearchPayloadDto<Admin> }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          searchPayloadDto,
        },
      ),
    );
  }

  // find all by permission group.
  findAllByPermissionGroup(permissionGroup: PermissionGroup): Promise<Admin[]> {
    return firstValueFrom<Admin[]>(
      this.adminsMicroservice.send<Admin[], PermissionGroup>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ALL_BY_PERMISSION_GROUP_MESSAGE_PATTERN}/v${this.version}`,
        },
        permissionGroup,
      ),
    );
  }

  // update password.
  updatePassword(adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, { adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN}/v${this.version}`,
        },
        { adminUpdatePasswordPayloadDto },
      ),
    );
  }

  // update profile.
  updateProfile(adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<Admin, { adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { adminUpdateProfilePayloadDto },
      ),
    );
  }

  // count.
  count(): Promise<number> {
    return firstValueFrom<number>(
      this.adminsMicroservice.send<number, any>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {},
      ),
    );
  }
}
