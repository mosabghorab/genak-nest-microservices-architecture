import { CreateDatabaseNotificationPayloadDto, RpcAuthenticationPayloadDto, SendPushNotificationPayloadDto, SendSmsNotificationPayloadDto } from '@app/common/dtos';

export interface INotificationsService {
  // send fcm notification.
  sendFcmNotification(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): void;

  // create database notification.
  createDatabaseNotification(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): void;

  // send sms notification.
  sendSmsNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void;
}
