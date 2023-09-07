import { Module } from '@nestjs/common';
import { Customer, CustomerAddress, DatabaseModule } from '@app/common';
import { CustomersController } from './v1/controllers/customers.controller';
import { CustomersService } from './v1/services/customers.service';
import { CustomerAddressesController } from './v1/controllers/customer-addresses.controller';
import { CustomerAddressesService } from './v1/services/customer-addresses.service';

@Module({
  imports: [DatabaseModule.forFeature([Customer, CustomerAddress])],
  controllers: [CustomersController, CustomerAddressesController],
  providers: [CustomersService, CustomerAddressesService],
})
export class RpcModule {}
