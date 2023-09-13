import { CreateDatabaseNotificationDto, SendPushNotificationPayloadDto, SendSmsNotificationDto } from '@app/common/dtos';

export interface INotificationsService {
  // send fcm notification.
  sendFcmNotification(sendFcmNotificationDto: SendPushNotificationPayloadDto): void;

  // create database notification.
  createDatabaseNotification(createDatabaseNotificationDto: CreateDatabaseNotificationDto): void;

  // send sms notification.
  sendSmsNotification(sendSmsNotificationDto: SendSmsNotificationDto): void;
}
