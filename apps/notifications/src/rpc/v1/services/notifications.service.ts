import { CreateDatabaseNotificationDto, SendFcmNotificationDto, SendSmsNotificationDto } from '@app/common';
import { FcmNotificationsService } from '../services/fcm-notifications.service';
import { DatabaseNotificationsService } from '../services/database-notifications.service';
import { SmsNotificationsService } from '../services/sms-notifications.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly fcmNotificationsService: FcmNotificationsService,
    private readonly databaseNotificationsService: DatabaseNotificationsService,
    private readonly smsNotificationsService: SmsNotificationsService,
  ) {}

  // send fcm notification.
  async sendFcmNotification(sendFcmNotificationDto: SendFcmNotificationDto): Promise<void> {
    await this.fcmNotificationsService.sendNotification(sendFcmNotificationDto);
  }

  // create database notification.
  async createDatabaseNotification(createDatabaseNotificationDto: CreateDatabaseNotificationDto): Promise<void> {
    await this.databaseNotificationsService.create(createDatabaseNotificationDto);
  }

  // send sms notification.
  sendSmsNotification(sendSmsNotificationDto: SendSmsNotificationDto): void {
    this.smsNotificationsService.sendNotification(sendSmsNotificationDto);
  }
}
