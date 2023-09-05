import { Module } from '@nestjs/common';
import {
  AttachmentsMicroserviceConstants,
  CustomClientsModule,
  DatabaseModule,
  DocumentsMicroserviceConstants,
  LocationsMicroserviceConstants,
  LocationVendor,
  StorageMicroserviceConstants,
  Vendor,
} from '@app/common';
import { AdminVendorsController } from './admin/v1/controllers/admin-vendors.controller';
import { AdminVendorsService } from './admin/v1/services/admin-vendors.service';
import { AdminVendorsValidation } from './admin/v1/validations/admin-vendors.validation';
import { LocationsVendorsService } from './shared/v1/services/locations-vendors.service';
import { CustomerVendorsController } from './customer/v1/controllers/customer-vendors.controller';
import { CustomerVendorsService } from './customer/v1/services/customer-vendors.service';
import { CustomerVendorsValidation } from './customer/v1/validations/customer-vendors.validation';

@Module({
  imports: [
    DatabaseModule.forFeature([Vendor, LocationVendor]),
    CustomClientsModule.register(LocationsMicroserviceConstants.MICROSERVICE_NAME, LocationsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(DocumentsMicroserviceConstants.MICROSERVICE_NAME, DocumentsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(AttachmentsMicroserviceConstants.MICROSERVICE_NAME, AttachmentsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(StorageMicroserviceConstants.MICROSERVICE_NAME, StorageMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
  ],
  controllers: [AdminVendorsController, CustomerVendorsController],
  providers: [AdminVendorsService, AdminVendorsValidation, CustomerVendorsService, CustomerVendorsValidation, LocationsVendorsService],
})
export class HttpModule {}
