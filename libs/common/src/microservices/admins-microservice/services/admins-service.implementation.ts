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
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
} from '@app/common';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientProxy } from '@nestjs/microservices';

export class AdminsServiceImpl implements IAdminsService {
  constructor(private readonly adminsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null> {
    return firstValueFrom<Admin | null>(
      this.adminsMicroservice.send<
        Admin | null,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>;
        }
      >(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin = await this.findOneById(
      rpcAuthenticationPayloadDto,
      new FindOneByIdPayloadDto<Admin>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // find one by email.
  async findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null> {
    return plainToInstance(
      Admin,
      await firstValueFrom<Admin | null>(
        this.adminsMicroservice.send<
          Admin | null,
          {
            findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>;
          }
        >(
          {
            cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ONE_BY_EMAIL_MESSAGE_PATTERN}/v${this.version}`,
          },
          { findOneByEmailPayloadDto },
        ),
      ),
    );
  }

  // find one or fail by email.
  async findOneOrFailByEmail(findOneOrFailByEmailPayloadDto: FindOneOrFailByEmailPayloadDto<Admin>): Promise<Admin> {
    const admin: Admin | null = await this.findOneByEmail(
      new FindOneByEmailPayloadDto<Admin>({
        email: findOneOrFailByEmailPayloadDto.email,
        relations: findOneOrFailByEmailPayloadDto.relations,
      }),
    );
    if (!admin) {
      throw new NotFoundException(findOneOrFailByEmailPayloadDto.failureMessage || 'Admin not found.');
    }
    return admin;
  }

  // search by name.
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]> {
    return firstValueFrom<Admin[]>(
      this.adminsMicroservice.send<
        Admin[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          searchPayloadDto: SearchPayloadDto<Admin>;
        }
      >(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          searchPayloadDto,
        },
      ),
    );
  }

  // find all by permission group.
  findAllByPermissionGroup(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, permissionGroup: PermissionGroup): Promise<Admin[]> {
    return firstValueFrom<Admin[]>(
      this.adminsMicroservice.send<
        Admin[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          permissionGroup: PermissionGroup;
        }
      >(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_FIND_ALL_BY_PERMISSION_GROUP_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, permissionGroup },
      ),
    );
  }

  // update password.
  updatePassword(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<
        Admin,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto;
        }
      >(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PASSWORD_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, adminUpdatePasswordPayloadDto },
      ),
    );
  }

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin> {
    return firstValueFrom<Admin>(
      this.adminsMicroservice.send<
        Admin,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto;
        }
      >(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, adminUpdateProfilePayloadDto },
      ),
    );
  }

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto): Promise<number> {
    return firstValueFrom<number>(
      this.adminsMicroservice.send<number, { rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto }>(
        {
          cmd: `${AdminsMicroserviceConstants.ADMINS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto },
      ),
    );
  }
}
