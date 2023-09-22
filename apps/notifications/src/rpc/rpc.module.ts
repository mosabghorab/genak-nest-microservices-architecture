import { Module } from '@nestjs/common';
import { DatabaseModule, Notification } from '@app/common';
import { NotificationsController } from './v1/controllers/notifications.controller';
import { NotificationsService } from './v1/services/notifications.service';
import { PushNotificationsService } from './v1/services/push-notifications.service';
import { SmsNotificationsService } from './v1/services/sms-notifications.service';
import { DatabaseNotificationsService } from './v1/services/database-notifications.service';

@Module({
  imports: [DatabaseModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, PushNotificationsService, SmsNotificationsService, DatabaseNotificationsService],
})
export class RpcModule {}
