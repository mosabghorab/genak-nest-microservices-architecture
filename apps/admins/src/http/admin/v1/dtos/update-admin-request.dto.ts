import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminRequestDto } from './create-admin-request.dto';
import { AdminStatus } from '@app/common';

export class UpdateAdminRequestDto extends PartialType(CreateAdminRequestDto) {
  @IsOptional()
  @IsEnum(AdminStatus)
  status?: AdminStatus;
}
