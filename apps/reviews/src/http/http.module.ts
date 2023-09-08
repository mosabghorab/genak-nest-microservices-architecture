import { Module } from '@nestjs/common';
import { CustomClientsModule, CustomersMicroserviceConstants, DatabaseModule, OrdersMicroserviceConstants, Review, VendorsMicroserviceConstants } from '@app/common';
import { AdminReviewsController } from './admin/v1/controllers/admin-reviews.controller';
import { CustomerReviewsController } from './customer/v1/controllers/customer-reviews.controller';
import { VendorReviewsController } from './vendor/v1/controllers/vendor-reviews.controller';
import { CustomerReviewsService } from './customer/v1/services/customer-reviews.service';
import { VendorReviewsService } from './vendor/v1/services/vendor-reviews.service';
import { AdminReviewsService } from './admin/v1/services/admin-reviews.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Review]),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(OrdersMicroserviceConstants.NAME, OrdersMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminReviewsController, CustomerReviewsController, VendorReviewsController],
  providers: [AdminReviewsService, CustomerReviewsService, VendorReviewsService],
})
export class HttpModule {}
