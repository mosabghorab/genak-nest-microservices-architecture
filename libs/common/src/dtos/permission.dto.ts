import { Expose, Type } from 'class-transformer';
import {
  PermissionAction,
  PermissionGroup,
  RolesPermissionsDto,
} from '@app/common';

export class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  action: PermissionAction;

  @Expose()
  group: PermissionGroup;

  @Expose()
  @Type(() => RolesPermissionsDto)
  rolesPermissions: RolesPermissionsDto[];
}
