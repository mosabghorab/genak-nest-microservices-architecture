import { IsArray, IsEnum, IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonConstants, ServiceType } from '@app/common';

export class CreateVendorDto {
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
  @Transform(({ value }) => parseInt(value))
  governorateId: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxProducts: number;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  regionsIds: number[];
}
