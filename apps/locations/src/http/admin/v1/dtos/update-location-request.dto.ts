import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateLocationRequestDto } from './create-location-request.dto';

export class UpdateLocationRequestDto extends PartialType(CreateLocationRequestDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  active?: boolean;
}
