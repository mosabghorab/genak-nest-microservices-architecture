import { Expose, Type } from 'class-transformer';
import { AdminsRolesDto, AdminStatus } from '@app/common';

export class AdminDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  status: AdminStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  accessToken: string;

  @Expose()
  @Type(() => AdminsRolesDto)
  adminsRoles: AdminsRolesDto[];
}
