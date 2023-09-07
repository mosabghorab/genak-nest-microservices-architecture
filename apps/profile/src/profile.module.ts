import { Module } from '@nestjs/common';
import {
  AdminsMicroserviceConstants,
  AuthGuard,
  CustomAuthModule,
  CustomClientsModule,
  CustomConfigModule,
  CustomersMicroserviceConstants,
  LocationsMicroserviceConstants,
  VendorsMicroserviceConstants,
} from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { AdminProfileController } from './admin/v1/controllers/admin-profile.controller';
import { AdminProfileService } from './admin/v1/services/admin-profile.service';
import { AdminProfileValidation } from './admin/v1/validations/admin-profile.validation';
import { CustomerProfileValidation } from './customer/v1/validations/customer-profile.validation';
import { CustomerProfileService } from './customer/v1/services/customer-profile.service';
import { CustomerProfileController } from './customer/v1/controllers/customer-profile.controller';
import { VendorProfileController } from './vendor/v1/controllers/vendor-profile.controller';
import { VendorProfileService } from './vendor/v1/services/vendor-profile.service';
import { VendorProfileValidation } from './vendor/v1/validations/vendor-profile.validation';

@Module({
  imports: [
    CustomConfigModule,
    CustomAuthModule,
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(LocationsMicroserviceConstants.NAME, LocationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminProfileController, CustomerProfileController, VendorProfileController],
  providers: [
    AdminProfileService,
    AdminProfileValidation,
    CustomerProfileService,
    CustomerProfileValidation,
    VendorProfileService,
    VendorProfileValidation,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ProfileModule {}
