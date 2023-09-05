import { Injectable } from '@nestjs/common';
import { VerificationCodeCreatedEvent } from '../events/verification-code-created.event';

@Injectable()
export class VerificationCodeCreatedHandler {
  constructor() {} // private readonly notificationsService: ClientProxy, // @Inject(Services.NOTIFICATIONS_SERVICE_NAME)

  // handle.
  // @OnEvent(CommonConstants.VERIFICATION_CODE_CREATED_EVENT)
  handle(verificationCodeCreatedEvent: VerificationCodeCreatedEvent): void {
    // this.notificationsService.emit<string, SendSmsNotificationDto>(
    //   `${Services.NOTIFICATIONS_SERVICE_EVENT_SEND_SMS_NOTIFICATION}/v${CommonConstants.NOTIFICATIONS_SERVICE_VERSION}`,
    //   verificationCodeCreatedEvent.sendSmsNotificationDto,
    // );
  }
}
