import { Module } from '@nestjs/common';
import {
  AdminsMicroserviceConstants,
  AuthMicroserviceConstants,
  Complain,
  CustomClientsModule,
  CustomersMicroserviceConstants,
  DatabaseModule,
  NotificationsMicroserviceConstants,
  OrdersMicroserviceConstants,
  StorageMicroserviceConstants,
  VendorsMicroserviceConstants,
} from '@app/common';
import { AdminComplainsController } from './admin/v1/controllers/admin-complains.controller';
import { CustomerComplainsController } from './customer/v1/controllers/customer-complains.controller';
import { VendorComplainsController } from './vendor/v1/controllers/vendor-complains.controller';
import { AdminComplainsService } from './admin/v1/services/admin-complains.service';
import { CustomerComplainsService } from './customer/v1/services/customer-complains.service';
import { VendorComplainsService } from './vendor/v1/services/vendor-complains.service';
import { ComplainStatusChangedHandler } from './admin/v1/handlers/complain-status-changed-handler';
import { ComplainCreatedHandler } from './shared/v1/handlers/complain-created-handler';

@Module({
  imports: [
    DatabaseModule.forFeature([Complain]),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(StorageMicroserviceConstants.NAME, StorageMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(NotificationsMicroserviceConstants.NAME, NotificationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AuthMicroserviceConstants.NAME, AuthMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminComplainsController, CustomerComplainsController, VendorComplainsController],
  providers: [AdminComplainsService, CustomerComplainsService, VendorComplainsService, ComplainStatusChangedHandler, ComplainCreatedHandler],
})
export class HttpModule {}
