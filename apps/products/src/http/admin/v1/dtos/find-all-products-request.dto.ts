import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindAllProductsRequestDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
