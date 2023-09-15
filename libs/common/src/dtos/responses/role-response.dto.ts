import { Expose, Type } from 'class-transformer';
import { AdminsRolesResponseDto, RolesPermissionsResponseDto } from '@app/common';

export class RoleResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => RolesPermissionsResponseDto)
  rolesPermissions: RolesPermissionsResponseDto[];

  @Expose()
  @Type(() => AdminsRolesResponseDto)
  usersRoles: AdminsRolesResponseDto[];
}
