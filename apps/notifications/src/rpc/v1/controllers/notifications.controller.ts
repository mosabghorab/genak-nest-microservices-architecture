import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateDatabaseNotificationDto, NotificationsMicroserviceConstants, SendFcmNotificationDto, SendSmsNotificationDto } from '@app/common';
import { NotificationsService } from '../services/notifications.service';
import { plainToInstance } from 'class-transformer';

const VERSION = '1';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  sendFcmNotification(@Payload() sendFcmNotificationDto: SendFcmNotificationDto): void {
    this.notificationsService.sendFcmNotification(plainToInstance(SendFcmNotificationDto, sendFcmNotificationDto));
  }

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  async createDatabaseNotification(@Payload() createDatabaseNotificationDto: CreateDatabaseNotificationDto): Promise<void> {
    await this.notificationsService.createDatabaseNotification(createDatabaseNotificationDto);
  }

  @EventPattern(`${NotificationsMicroserviceConstants.NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN}/v${VERSION}`)
  sendSmsNotification(@Payload() sendSmsNotificationDto: SendSmsNotificationDto): void {
    this.notificationsService.sendSmsNotification(sendSmsNotificationDto);
  }
}
