import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '@app/common';

export class CreateProductRequestDto {
  @IsString()
  name: string;

  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  price: number;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  size: number;
}
