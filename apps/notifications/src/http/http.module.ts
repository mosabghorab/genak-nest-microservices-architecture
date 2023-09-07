import { Module } from '@nestjs/common';
import { DatabaseModule, Notification } from '@app/common';
import { NotificationsController } from './shared/v1/controllers/notifications.controller';
import { NotificationsService } from './shared/v1/services/notifications.service';
import { FcmNotificationsService } from './shared/v1/services/fcm-notifications.service';
import { SmsNotificationsService } from './shared/v1/services/sms-notifications.service';
import { DatabaseNotificationsService } from './shared/v1/services/database-notifications.service';

@Module({
  imports: [DatabaseModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService, FcmNotificationsService, SmsNotificationsService, DatabaseNotificationsService],
})
export class HttpModule {}
