import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindSalesReportsRequestDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
