import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindAllProductsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
