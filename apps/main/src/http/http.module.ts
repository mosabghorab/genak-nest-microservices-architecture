import { Module } from '@nestjs/common';
import { SearchController } from './admin/v1/controllers/search.controller';
import { SearchService } from './admin/v1/services/search.service';
import { AdminsMicroserviceConstants, CustomClientsModule, CustomersMicroserviceConstants, OrdersMicroserviceConstants, VendorsMicroserviceConstants } from '@app/common';
import { BackupController } from './admin/v1/controllers/backup.controller';
import { BackupService } from './admin/v1/services/backup.service';

@Module({
  imports: [
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [SearchController, BackupController],
  providers: [SearchService, BackupService],
})
export class HttpModule {}
