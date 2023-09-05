import { Expose, Type } from 'class-transformer';
import { AdminDto, RoleDto } from '@app/common';

export class AdminsRolesDto {
  @Expose()
  id: number;

  @Expose()
  adminId: number;

  @Expose()
  roleId: number;

  @Expose()
  @Type(() => AdminDto)
  admin: AdminDto;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
