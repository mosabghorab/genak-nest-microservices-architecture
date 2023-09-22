import { CreateDatabaseNotificationPayloadDto, SendPushNotificationPayloadDto, SendSmsNotificationPayloadDto } from '@app/common';
import { PushNotificationsService } from './push-notifications.service';
import { DatabaseNotificationsService } from '../services/database-notifications.service';
import { SmsNotificationsService } from '../services/sms-notifications.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly fcmNotificationsService: PushNotificationsService,
    private readonly databaseNotificationsService: DatabaseNotificationsService,
    private readonly smsNotificationsService: SmsNotificationsService,
  ) {}

  // send fcm notification.
  async sendFcmNotification(sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): Promise<void> {
    await this.fcmNotificationsService.sendNotification(sendPushNotificationPayloadDto);
  }

  // create database notification.
  async createDatabaseNotification(createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): Promise<void> {
    await this.databaseNotificationsService.create(createDatabaseNotificationPayloadDto);
  }

  // send sms notification.
  sendSmsNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    this.smsNotificationsService.sendNotification(sendSmsNotificationPayloadDto);
  }
}
