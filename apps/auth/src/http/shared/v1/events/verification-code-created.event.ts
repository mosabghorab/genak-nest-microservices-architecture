import { SendSmsNotificationPayloadDto } from '@app/common';

export class VerificationCodeCreatedEvent {
  constructor(public readonly sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto) {}
}
