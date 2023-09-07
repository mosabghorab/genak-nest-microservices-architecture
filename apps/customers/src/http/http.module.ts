import { Module } from '@nestjs/common';
import { CustomClientsModule, Customer, CustomerAddress, DatabaseModule, LocationsMicroserviceConstants } from '@app/common';
import { AdminCustomersController } from './admin/v1/controllers/admin-customers.controller';
import { AdminCustomersService } from './admin/v1/services/admin-customers.service';
import { AdminCustomersValidation } from './admin/v1/validations/admin-customers.validation';
import { CustomerAddressesController } from './customer/v1/controllers/customer-addresses.controller';
import { CustomerAddressesService } from './customer/v1/services/customer-addresses.service';

@Module({
  imports: [DatabaseModule.forFeature([Customer, CustomerAddress]), CustomClientsModule.register(LocationsMicroserviceConstants.NAME, LocationsMicroserviceConstants.CONFIG_NAME)],
  controllers: [AdminCustomersController, CustomerAddressesController],
  providers: [AdminCustomersService, AdminCustomersValidation, CustomerAddressesService],
})
export class HttpModule {}
