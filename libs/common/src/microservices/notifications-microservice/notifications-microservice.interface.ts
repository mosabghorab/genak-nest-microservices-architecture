import { CreateDatabaseNotificationDto, SendFcmNotificationDto, SendSmsNotificationDto } from '@app/common';

export interface INotificationsMicroservice {
  sendFcmNotification(sendFcmNotificationDto: SendFcmNotificationDto): void;

  createDatabaseNotification(createDatabaseNotificationDto: CreateDatabaseNotificationDto): void;

  sendSmsNotification(sendSmsNotificationDto: SendSmsNotificationDto): void;
}
