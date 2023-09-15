import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonConstants, VendorStatus } from '@app/common';

export class UpdateVendorRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  commercialName?: string;

  @IsOptional()
  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone?: string;

  @IsOptional()
  @IsEnum(VendorStatus)
  status?: VendorStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  maxProducts?: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ValidateIf((obj) => obj.regionsIds != null)
  governorateId?: number;

  @IsArray()
  @Transform(({ value }) => JSON.parse(value))
  @ValidateIf((obj) => obj.governorateId != null)
  regionsIds?: number[];
}
