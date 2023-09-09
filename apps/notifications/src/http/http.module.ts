import { Module } from '@nestjs/common';
import { ComplainsMicroserviceConstants, CustomClientsModule, DatabaseModule, Notification, OrdersMicroserviceConstants } from '@app/common';
import { NotificationsController } from './shared/v1/controllers/notifications.controller';
import { NotificationsService } from './shared/v1/services/notifications.service';
import { DatabaseNotificationsService } from './shared/v1/services/database-notifications.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Notification]),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(ComplainsMicroserviceConstants.NAME, ComplainsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, DatabaseNotificationsService],
})
export class HttpModule {}
