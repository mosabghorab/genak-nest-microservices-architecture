import { Module } from '@nestjs/common';
import { ReportsController } from './admin/v1/controllers/reports.controller';
import { ReportsService } from './admin/v1/services/reports.service';
import {
  AdminsMicroserviceConstants,
  CustomClientsModule,
  CustomersMicroserviceConstants,
  LocationsMicroserviceConstants,
  OrdersMicroserviceConstants,
  ProductsMicroserviceConstants,
  VendorsMicroserviceConstants,
} from '@app/common';

@Module({
  imports: [
    CustomClientsModule.register(LocationsMicroserviceConstants.NAME, LocationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(ProductsMicroserviceConstants.NAME, ProductsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class HttpModule {}
