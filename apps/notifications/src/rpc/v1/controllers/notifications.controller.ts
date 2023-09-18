import { Controller, UseGuards } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  AllowFor,
  AuthGuard,
  CreateDatabaseNotificationPayloadDto,
  NotificationsMicroserviceConstants,
  Public,
  SendPushNotificationPayloadDto,
  SendSmsNotificationPayloadDto,
  SkipAdminRoles,
  UserType,
} from '@app/common';
import { NotificationsService } from '../services/notifications.service';
import { plainToInstance } from 'class-transformer';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  async sendFcmNotification(@Payload('sendPushNotificationPayloadDto') sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): Promise<void> {
    await this.notificationsService.sendFcmNotification(plainToInstance(SendPushNotificationPayloadDto, sendPushNotificationPayloadDto));
  }

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  async createDatabaseNotification(@Payload('createDatabaseNotificationPayloadDto') createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): Promise<void> {
    await this.notificationsService.createDatabaseNotification(createDatabaseNotificationPayloadDto);
  }

  @Public()
  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  sendSmsNotification(@Payload('sendSmsNotificationPayloadDto') sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    this.notificationsService.sendSmsNotification(sendSmsNotificationPayloadDto);
  }
}
