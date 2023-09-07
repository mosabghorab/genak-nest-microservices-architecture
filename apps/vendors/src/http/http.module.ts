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
    CustomClientsModule.register(LocationsMicroserviceConstants.NAME, LocationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(DocumentsMicroserviceConstants.NAME, DocumentsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AttachmentsMicroserviceConstants.NAME, AttachmentsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(StorageMicroserviceConstants.NAME, StorageMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminVendorsController, CustomerVendorsController],
  providers: [AdminVendorsService, AdminVendorsValidation, CustomerVendorsService, CustomerVendorsValidation, LocationsVendorsService],
})
export class HttpModule {}
