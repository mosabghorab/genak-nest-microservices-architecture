import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindSalesReportsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
