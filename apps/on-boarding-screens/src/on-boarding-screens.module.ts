import { Module } from '@nestjs/common';
import { AuthGuard, CustomAuthModule, CustomClientsModule, CustomConfigModule, DatabaseModule, OnBoardingScreen, StorageMicroserviceConstants } from '@app/common';
import { AdminOnBoardingScreensController } from './admin/v1/controllers/admin-on-boarding-screens.controller';
import { OnBoardingScreensController } from './shared/v1/controllers/on-boarding-screens.controller';
import { AdminOnBoardingScreensService } from './admin/v1/services/admin-on-boarding-screens.service';
import { OnBoardingScreensService } from './shared/v1/services/on-boarding-screens.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    CustomConfigModule,
    CustomAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([OnBoardingScreen]),
    CustomClientsModule.register(StorageMicroserviceConstants.MICROSERVICE_NAME, StorageMicroserviceConstants.MICROSERVICE_CONFIG_NAME),
  ],
  controllers: [AdminOnBoardingScreensController, OnBoardingScreensController],
  providers: [
    AdminOnBoardingScreensService,
    OnBoardingScreensService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class OnBoardingScreensModule {}
