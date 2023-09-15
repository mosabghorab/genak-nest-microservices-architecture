import { Expose, Type } from 'class-transformer';
import { AdminResponseDto, RoleResponseDto } from '@app/common';

export class AdminsRolesResponseDto {
  @Expose()
  id: number;

  @Expose()
  adminId: number;

  @Expose()
  roleId: number;

  @Expose()
  @Type(() => AdminResponseDto)
  admin: AdminResponseDto;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;
}
