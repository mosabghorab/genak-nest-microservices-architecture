import { Inject, Injectable } from '@nestjs/common';
import { VerificationCodeCreatedEvent } from '../events/verification-code-created.event';
import { NotificationsMicroserviceConnection, NotificationsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VerificationCodeCreatedHandler {
  private readonly notificationsMicroserviceConnection: NotificationsMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME)
    private readonly notificationsMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceConnection = new NotificationsMicroserviceConnection(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.VERIFICATION_CODE_CREATED_EVENT)
  handle(verificationCodeCreatedEvent: VerificationCodeCreatedEvent): void {
    this.notificationsMicroserviceConnection.notificationsServiceImpl.sendSmsNotification(verificationCodeCreatedEvent.sendSmsNotificationDto);
  }
}
