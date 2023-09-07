import { IsBoolean, IsNumber, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonConstants } from '@app/common';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  notificationsEnabled?: boolean;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  @ValidateIf((obj) => obj.regionId != null)
  governorateId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  @ValidateIf((obj) => obj.governorateId != null)
  regionId: number;
}
