import { Matches } from 'class-validator';
import { CommonConstants } from '@app/common';

export class SendVerificationCodeDto {
  @Matches(CommonConstants.PHONE_VALIDATION_REGX, {
    message: 'Invalid phone format.',
  })
  phone: string;
}
