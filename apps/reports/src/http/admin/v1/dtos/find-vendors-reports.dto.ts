import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindVendorsReportsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
