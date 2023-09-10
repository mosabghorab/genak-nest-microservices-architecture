import { CreateDatabaseNotificationDto, SendFcmNotificationDto, SendSmsNotificationDto } from '@app/common/dtos';

export interface INotificationsService {
  // send fcm notification.
  sendFcmNotification(sendFcmNotificationDto: SendFcmNotificationDto): void;

  // create database notification.
  createDatabaseNotification(createDatabaseNotificationDto: CreateDatabaseNotificationDto): void;

  // send sms notification.
  sendSmsNotification(sendSmsNotificationDto: SendSmsNotificationDto): void;
}
