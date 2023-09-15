import { CreateDatabaseNotificationPayloadDto, SendPushNotificationPayloadDto, SendSmsNotificationPayloadDto } from '@app/common/dtos';

export interface INotificationsService {
  // send fcm notification.
  sendFcmNotification(sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): void;

  // create database notification.
  createDatabaseNotification(createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): void;

  // send sms notification.
  sendSmsNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void;
}
