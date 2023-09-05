import { Module } from '@nestjs/common';
import { CustomClientsModule, Customer, DatabaseModule, LocationsMicroserviceConstants } from '@app/common';
import { AdminCustomersController } from './admin/v1/controllers/admin-customers.controller';
import { AdminCustomersService } from './admin/v1/services/admin-customers.service';
import { AdminCustomersValidation } from './admin/v1/validations/admin-customers.validation';

@Module({
  imports: [DatabaseModule.forFeature([Customer]), CustomClientsModule.register(LocationsMicroserviceConstants.MICROSERVICE_NAME, LocationsMicroserviceConstants.MICROSERVICE_CONFIG_NAME)],
  controllers: [AdminCustomersController],
  providers: [AdminCustomersService, AdminCustomersValidation],
})
export class HttpModule {}
