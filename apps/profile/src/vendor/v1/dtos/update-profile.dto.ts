import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonConstants } from '@app/common';

export class UpdateProfileDto {
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
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  notificationsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  available?: boolean;
}
