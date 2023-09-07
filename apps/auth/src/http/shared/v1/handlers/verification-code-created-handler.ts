import { Inject, Injectable } from '@nestjs/common';
import { VerificationCodeCreatedEvent } from '../events/verification-code-created.event';
import { NotificationsMicroserviceConstants, NotificationsMicroserviceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VerificationCodeCreatedHandler {
  private readonly notificationsMicroserviceImpl: NotificationsMicroserviceImpl;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME)
    private readonly notificationsMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceImpl = new NotificationsMicroserviceImpl(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.VERIFICATION_CODE_CREATED_EVENT)
  handle(verificationCodeCreatedEvent: VerificationCodeCreatedEvent): void {
    this.notificationsMicroserviceImpl.sendSmsNotification(verificationCodeCreatedEvent.sendSmsNotificationDto);
  }
}
