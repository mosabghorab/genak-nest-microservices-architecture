import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto, RoleResponseDto } from '@app/common';

export class RolesPermissionsResponseDto {
  @Expose()
  id: number;

  @Expose()
  roleId: number;

  @Expose()
  permissionId: number;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;

  @Expose()
  @Type(() => PermissionResponseDto)
  permission: PermissionResponseDto;
}
