import {
  Admin,
  AdminUpdatePasswordPayloadDto,
  AdminUpdateProfilePayloadDto,
  FindOneByEmailPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrFailByEmailPayloadDto,
  FindOneOrFailByIdPayloadDto,
  PermissionGroup,
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
} from '@app/common';

export interface IAdminsService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Admin>): Promise<Admin>;

  // find one by email.
  findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null>;

  // find one or fail by email.
  findOneOrFailByEmail(findOneOrFailByEmailPayloadDto: FindOneOrFailByEmailPayloadDto<Admin>): Promise<Admin>;

  // search by name.
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]>;

  // find all by permission group.
  findAllByPermissionGroup(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, permissionGroup: PermissionGroup): Promise<Admin[]>;

  // update password.
  updatePassword(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin>;

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin>;

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto): Promise<number>;
}
