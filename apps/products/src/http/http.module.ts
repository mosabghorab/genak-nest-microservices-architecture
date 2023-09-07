import { Module } from '@nestjs/common';
import { CustomClientsModule, DatabaseModule, Product, StorageMicroserviceConstants } from '@app/common';
import { AdminProductsController } from './admin/v1/controllers/admin-products.controller';
import { CustomerProductsController } from './customer/v1/controllers/customer-products.controller';
import { AdminProductsService } from './admin/v1/services/admin-products.service';
import { CustomerProductsService } from './customer/v1/services/customer-products.service';

@Module({
  imports: [DatabaseModule.forFeature([Product]), CustomClientsModule.register(StorageMicroserviceConstants.NAME, StorageMicroserviceConstants.CONFIG_NAME)],
  controllers: [AdminProductsController, CustomerProductsController],
  providers: [AdminProductsService, CustomerProductsService],
})
export class HttpModule {}
