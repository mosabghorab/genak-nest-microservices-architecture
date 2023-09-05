import { IsEnum, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { ServiceType } from '@app/common/enums';
import { CommonConstants } from '@app/common/constants';

export class VendorSignUpDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsString()
  name: string;

  @IsString()
  commercialName: string;

  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  governorateId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  maxProducts: number;
}
