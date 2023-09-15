import { PartialType } from '@nestjs/mapped-types';
import { CreateReasonRequestDto } from './create-reason-request.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateReasonRequestDto extends PartialType(CreateReasonRequestDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  active?: boolean;
}
