import { IsNumber, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { CommonConstants } from '@app/common/constants';

export class SignUpDto {
  @IsString()
  name: string;

  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  governorateId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  regionId: number;
}
