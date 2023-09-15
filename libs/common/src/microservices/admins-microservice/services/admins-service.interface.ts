import {
  Admin,
  AdminUpdatePasswordPayloadDto,
  AdminUpdateProfilePayloadDto,
  FindOneByEmailPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrFailByEmailPayloadDto,
  FindOneOrFailByIdPayloadDto,
  PermissionGroup,
  SearchPayloadDto,
} from '@app/common';

export interface IAdminsService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Admin>): Promise<Admin | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Admin>): Promise<Admin>;

  // find one by email.
  findOneByEmail(findOneByEmailPayloadDto: FindOneByEmailPayloadDto<Admin>): Promise<Admin | null>;

  // find one or fail by email.
  findOneOrFailByEmail(findOneOrFailByEmailPayloadDto: FindOneOrFailByEmailPayloadDto<Admin>): Promise<Admin>;

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Admin>): Promise<Admin[]>;

  // find all by permission group.
  findAllByPermissionGroup(permissionGroup: PermissionGroup): Promise<Admin[]>;

  // update password.
  updatePassword(adminUpdatePasswordPayloadDto: AdminUpdatePasswordPayloadDto): Promise<Admin>;

  // update profile.
  updateProfile(adminUpdateProfilePayloadDto: AdminUpdateProfilePayloadDto): Promise<Admin>;

  // count.
  count(): Promise<number>;
}
