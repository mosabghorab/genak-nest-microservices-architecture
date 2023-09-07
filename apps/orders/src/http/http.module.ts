import { Module } from '@nestjs/common';
import {
  AuthMicroserviceConstants,
  CustomClientsModule,
  CustomersMicroserviceConstants,
  DatabaseModule,
  NotificationsMicroserviceConstants,
  Order,
  ReasonsMicroserviceConstants,
  VendorsMicroserviceConstants,
} from '@app/common';
import { AdminOrdersController } from './admin/v1/controllers/admin-orders.controller';
import { CustomerOrdersController } from './customer/v1/controllers/customer-orders.controller';
import { AdminOrdersService } from './admin/v1/services/admin-orders.service';
import { CustomerOrdersService } from './customer/v1/services/customer-orders.service';
import { VendorOrdersController } from './vendor/v1/controllers/vendor-orders.controller';
import { OrdersController } from './shared/v1/controllers/orders.controller';
import { VendorOrdersService } from './vendor/v1/services/vendor-orders.service';
import { OrdersService } from './shared/v1/services/orders.service';
import { OrderStatusChangedHandler } from './shared/v1/handlers/order-status-changed-handler';
import { OrderCreatedHandler } from './customer/v1/handlers/order-created-handler';

@Module({
  imports: [
    DatabaseModule.forFeature([Order]),
    CustomClientsModule.register(AuthMicroserviceConstants.NAME, AuthMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(NotificationsMicroserviceConstants.NAME, NotificationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(ReasonsMicroserviceConstants.NAME, ReasonsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminOrdersController, CustomerOrdersController, VendorOrdersController, OrdersController],
  providers: [AdminOrdersService, CustomerOrdersService, VendorOrdersService, OrdersService, OrderStatusChangedHandler, OrderCreatedHandler],
})
export class HttpModule {}
