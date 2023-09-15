import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateDatabaseNotificationPayloadDto, NotificationsMicroserviceConstants, SendPushNotificationPayloadDto, SendSmsNotificationPayloadDto } from '@app/common';
import { NotificationsService } from '../services/notifications.service';

const VERSION = '1';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  async sendFcmNotification(@Payload('sendPushNotificationPayloadDto') sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): Promise<void> {
    await this.notificationsService.sendFcmNotification(sendPushNotificationPayloadDto);
  }

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  async createDatabaseNotification(@Payload('createDatabaseNotificationPayloadDto') createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto): Promise<void> {
    await this.notificationsService.createDatabaseNotification(createDatabaseNotificationPayloadDto);
  }

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  sendSmsNotification(@Payload('sendSmsNotificationPayloadDto') sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    this.notificationsService.sendSmsNotification(sendSmsNotificationPayloadDto);
  }
}
