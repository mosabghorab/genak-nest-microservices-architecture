import { ClientProxy } from '@nestjs/microservices';
import { CreateDatabaseNotificationDto, INotificationsMicroservice, NotificationsMicroserviceConstants, SendFcmNotificationDto, SendSmsNotificationDto } from '@app/common';

export class NotificationsMicroserviceImpl implements INotificationsMicroservice {
  constructor(private readonly notificationsMicroservice: ClientProxy, private readonly version: string) {}

  // create database notification.
  createDatabaseNotification(createDatabaseNotificationDto: CreateDatabaseNotificationDto): void {
    this.notificationsMicroservice.emit<string, CreateDatabaseNotificationDto>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      createDatabaseNotificationDto,
    );
  }

  // send fcm notification.
  sendFcmNotification(sendFcmNotificationDto: SendFcmNotificationDto): void {
    this.notificationsMicroservice.emit<string, SendFcmNotificationDto>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      sendFcmNotificationDto,
    );
  }

  // send sms notification.
  sendSmsNotification(sendSmsNotificationDto: SendSmsNotificationDto): void {
    this.notificationsMicroservice.emit<string, SendSmsNotificationDto>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      sendSmsNotificationDto,
    );
  }
}
