import { Module } from '@nestjs/common';
import {
  AdminsMicroserviceConstants,
  AuthMicroserviceConstants,
  ComplainsMicroserviceConstants,
  CustomClientsModule,
  CustomersMicroserviceConstants,
  DatabaseModule,
  Notification,
  OrdersMicroserviceConstants,
  VendorsMicroserviceConstants,
} from '@app/common';
import { NotificationsController } from './shared/v1/controllers/notifications.controller';
import { NotificationsService } from './shared/v1/services/notifications.service';
import { DatabaseNotificationsService } from './shared/v1/services/database-notifications.service';
import { AdminNotificationsController } from './admin/v1/controllers/admin-notifications.controller';
import { AdminNotificationsService } from './admin/v1/services/admin-notifications.service';
import { AdminPushNotificationsService } from './admin/v1/services/admin-push-notifications.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Notification]),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(ComplainsMicroserviceConstants.NAME, ComplainsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AuthMicroserviceConstants.NAME, AuthMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [NotificationsController, AdminNotificationsController],
  providers: [NotificationsService, DatabaseNotificationsService, AdminNotificationsService, AdminPushNotificationsService],
})
export class HttpModule {}
