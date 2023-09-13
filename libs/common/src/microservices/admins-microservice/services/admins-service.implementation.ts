import {
  Admin,
  AdminsMicroserviceConstants,
  AdminUpdatePasswordDto,
  AdminUpdateProfileDto,
  FindOneByEmailDto,
  FindOneByIdDto,
  FindOneOrFailByEmailDto,
  FindOneOrFailByIdDto,
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
    const admin: Admin = await this.findOneById(<FindOneByIdDto<Admin>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
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
    const admin: Admin = await this.findOneByEmail(<FindOneByEmailDto<Admin>>{
      email: findOneOrFailByEmailDto.email,
      relations: findOneOrFailByEmailDto.relations,
    });
    if (!admin) {
      throw new NotFoundException(findOneOrFailByEmailDto.failureMessage || 'Admin not found.');
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
