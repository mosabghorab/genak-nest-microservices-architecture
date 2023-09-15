import { Module } from '@nestjs/common';
import {
  AdminsMicroserviceConstants,
  CustomClientsModule,
  CustomersMicroserviceConstants,
  DatabaseModule,
  DocumentsMicroserviceConstants,
  FcmToken,
  LocationsMicroserviceConstants,
  NotificationsMicroserviceConstants,
  VendorsMicroserviceConstants,
  VerificationCode,
} from '@app/common';
import { AdminAuthController } from './admin/v1/controllers/admin-auth.controller';
import { CustomerAuthController } from './customer/v1/controllers/customer-auth.controller';
import { VendorAuthController } from './vendor/v1/controllers/vendor-auth.controller';
import { AdminAuthService } from './admin/v1/services/admin-auth.service';
import { CustomerAuthService } from './customer/v1/services/customer-auth.service';
import { VendorAuthService } from './vendor/v1/services/vendor-auth.service';
import { PushTokensService } from './shared/v1/services/push-tokens.service';
import { VerificationCodesService } from './shared/v1/services/verification-codes.service';
import { CustomerAuthValidation } from './customer/v1/validations/customer-auth.validation';
import { VendorAuthValidation } from './vendor/v1/validations/vendor-auth.validation';
import { VerificationCodeCreatedHandler } from './shared/v1/handlers/verification-code-created-handler';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    DatabaseModule.forFeature([FcmToken, VerificationCode]),
    EventEmitterModule.forRoot(),
    CustomClientsModule.register(LocationsMicroserviceConstants.NAME, LocationsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(AdminsMicroserviceConstants.NAME, AdminsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(CustomersMicroserviceConstants.NAME, CustomersMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(VendorsMicroserviceConstants.NAME, VendorsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(DocumentsMicroserviceConstants.NAME, DocumentsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(NotificationsMicroserviceConstants.NAME, NotificationsMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [AdminAuthController, CustomerAuthController, VendorAuthController],
  providers: [AdminAuthService, CustomerAuthService, VendorAuthService, PushTokensService, VerificationCodesService, CustomerAuthValidation, VendorAuthValidation, VerificationCodeCreatedHandler],
})
export class HttpModule {}
