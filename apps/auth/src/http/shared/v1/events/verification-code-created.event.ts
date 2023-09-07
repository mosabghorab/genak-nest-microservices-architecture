import { SendSmsNotificationDto } from '@app/common';

export class VerificationCodeCreatedEvent {
  constructor(public readonly sendSmsNotificationDto: SendSmsNotificationDto) {}
}
