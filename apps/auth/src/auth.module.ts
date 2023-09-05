import { Module } from '@nestjs/common';
import {
  AdminsMicroserviceConstants,
  AuthGuard,
  CustomAuthModule,
  CustomClientsModule,
  CustomConfigModule,
  CustomersMicroserviceConstants,
  DatabaseModule,
  DocumentsMicroserviceConstants,
  FcmToken,
  LocationsMicroserviceConstants,
  VendorsMicroserviceConstants,
  VerificationCode,
} from '@app/common';
import { AdminAuthController } from './admin/v1/controllers/admin-auth.controller';
import { CustomerAuthController } from './customer/v1/controllers/customer-auth.controller';
import { VendorAuthController } from './vendor/v1/controllers/vendor-auth.controller';
import { AdminAuthService } from './admin/v1/services/admin-auth.service';
import { CustomerAuthService } from './customer/v1/services/customer-auth.service';
import { VendorAuthService } from './vendor/v1/services/vendor-auth.service';
import { CustomerAuthValidation } from './customer/v1/validations/customer-auth.validation';
import { VendorAuthValidation } from './vendor/v1/validations/vendor-auth.validation';
import { FcmTokensService } from './shared/v1/services/fcm-tokens.service';
import { VerificationCodesService } from './shared/v1/services/verification-codes.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CustomConfigModule,
    CustomAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([FcmToken, VerificationCode]),
    EventEmitterModule.forRoot(),
    CustomClientsModule.register(LocationsMicroserviceConstants.MICROSERVICE_NAME, LocationsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.MICROSERVICE_NAME, AdminsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.MICROSERVICE_NAME, CustomersMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.MICROSERVICE_NAME, VendorsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
    CustomClientsModule.register(DocumentsMicroserviceConstants.MICROSERVICE_NAME, DocumentsMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
  ],
  controllers: [AdminAuthController, CustomerAuthController, VendorAuthController],
  providers: [
    AdminAuthService,
    CustomerAuthService,
    VendorAuthService,
    FcmTokensService,
    VerificationCodesService,
    CustomerAuthValidation,
    VendorAuthValidation,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
