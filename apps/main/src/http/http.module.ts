import { Module } from '@nestjs/common';
import { SearchController } from './admin/v1/controllers/search.controller';
import { SearchService } from './admin/v1/services/search.service';
import { AdminsMicroserviceConstants, CustomClientsModule, CustomersMicroserviceConstants, OrdersMicroserviceConstants, VendorsMicroserviceConstants } from '@app/common';

@Module({
  imports: [
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class HttpModule {}
