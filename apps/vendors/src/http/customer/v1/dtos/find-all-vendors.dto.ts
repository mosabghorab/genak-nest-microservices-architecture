import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '@app/common';

export class FindAllVendorsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  governorateId?: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }): any => JSON.parse(value))
  regionsIds?: number[];
}
