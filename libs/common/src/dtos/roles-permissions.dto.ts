import { Expose, Type } from 'class-transformer';
import { PermissionDto, RoleDto } from '@app/common';

export class RolesPermissionsDto {
  @Expose()
  id: number;

  @Expose()
  roleId: number;

  @Expose()
  permissionId: number;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;

  @Expose()
  @Type(() => PermissionDto)
  permission: PermissionDto;
}
