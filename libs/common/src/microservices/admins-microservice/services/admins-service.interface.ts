import { Admin, AdminUpdatePasswordDto, AdminUpdateProfileDto, FindOneByEmailDto, FindOneByIdDto, FindOneOrFailByEmailDto, FindOneOrFailByIdDto, PermissionGroup } from '@app/common';

export interface IAdminsService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Admin>): Promise<Admin | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Admin>): Promise<Admin>;

  // find one by email.
  findOneByEmail(findOneByEmailDto: FindOneByEmailDto<Admin>): Promise<Admin | null>;

  // find one or fail by email.
  findOneOrFailByEmail(findOneOrFailByEmailDto: FindOneOrFailByEmailDto<Admin>): Promise<Admin>;

  // find all by permission group.
  findAllByPermissionGroup(permissionGroup: PermissionGroup): Promise<Admin[]>;

  // update password.
  updatePassword(adminUpdatePasswordDto: AdminUpdatePasswordDto): Promise<Admin>;

  // update profile.
  updateProfile(adminUpdateProfileDto: AdminUpdateProfileDto): Promise<Admin>;

  // count.
  count(): Promise<number>;
}
