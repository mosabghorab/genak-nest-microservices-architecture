import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '@app/common';

export class FindAllReviewsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsString()
  orderUniqueId?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }): Date => new Date(value))
  date?: Date;
}
