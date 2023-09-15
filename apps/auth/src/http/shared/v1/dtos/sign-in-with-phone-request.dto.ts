import { IsString, Matches } from 'class-validator';
import { CommonConstants } from '@app/common';

export class SignInWithPhoneRequestDto {
  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone: string;

  @IsString()
  code: string;

  @IsString()
  fcmToken: string;
}
