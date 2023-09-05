import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { AdminStatus } from '@app/common';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsEnum(AdminStatus)
  status?: AdminStatus;
}
