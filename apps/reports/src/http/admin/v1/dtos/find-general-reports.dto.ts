import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindGeneralReportsDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
