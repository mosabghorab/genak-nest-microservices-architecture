import { IsEnum } from 'class-validator';
import { ServiceType } from '@app/common';

export class FindGeneralReportsRequestDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;
}
