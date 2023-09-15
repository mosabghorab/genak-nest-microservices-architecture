import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindVendorsReportsRequestDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
