import { ClientProxy } from '@nestjs/microservices';
import {
  CreateDatabaseNotificationPayloadDto,
  INotificationsService,
  NotificationsMicroserviceConstants,
  RpcAuthenticationPayloadDto,
  SendPushNotificationPayloadDto,
  SendSmsNotificationPayloadDto,
} from '@app/common';

export class NotificationsServiceImpl implements INotificationsService {
  constructor(private readonly notificationsMicroservice: ClientProxy, private readonly version: string) {}

  // create database notification.
  createDatabaseNotification(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<
      string,
      {
        rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
        createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto;
      }
    >(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${this.version}`, {
      rpcAuthenticationPayloadDto,
      createDatabaseNotificationPayloadDto,
    });
  }

  // send fcm notification.
  sendFcmNotification(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<
      string,
      {
        rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
        sendPushNotificationPayloadDto: SendPushNotificationPayloadDto;
      }
    >(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${this.version}`, {
      rpcAuthenticationPayloadDto,
      sendPushNotificationPayloadDto,
    });
  }

  // send sms notification.
  sendSmsNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    this.notificationsMicroservice.emit<string, { sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto }>(
      `${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${this.version}`,
      { sendSmsNotificationPayloadDto },
    );
  }
}
