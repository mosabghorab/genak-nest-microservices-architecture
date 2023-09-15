import { ClientProxy } from '@nestjs/microservices';
import { CreateDatabaseNotificationPayloadDto, INotificationsService, NotificationsMicroserviceConstants, SendPushNotificationPayloadDto, SendSmsNotificationPayloadDto } from '@app/common';

export class NotificationsServiceImpl implements INotificationsService {
  constructor(private readonly notificationsMicroservice: ClientProxy, private readonly version: string) {}

  // create database notification.
  createDatabaseNotification(createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<
      string,
      {
        createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto;
      }
    >(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${this.version}`, { createDatabaseNotificationPayloadDto });
  }

  // send fcm notification.
  sendFcmNotification(sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<string, { sendPushNotificationPayloadDto: SendPushNotificationPayloadDto }>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      { sendPushNotificationPayloadDto },
    );
  }

  // send sms notification.
  sendSmsNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<string, { sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto }>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      { sendSmsNotificationPayloadDto },
    );
  }
}
