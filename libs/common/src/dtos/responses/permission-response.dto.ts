import { Expose, Type } from 'class-transformer';
import { PermissionAction, PermissionGroup, RolesPermissionsResponseDto } from '@app/common';

export class PermissionResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  action: PermissionAction;

  @Expose()
  group: PermissionGroup;

  @Expose()
  @Type(() => RolesPermissionsResponseDto)
  rolesPermissions: RolesPermissionsResponseDto[];
}
