import { Module } from '@nestjs/common';
import { Customer, DatabaseModule } from '@app/common';
import { CustomersController } from './v1/controllers/customers.controller';
import { CustomersService } from './v1/services/customers.service';

@Module({
  imports: [DatabaseModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class RpcModule {}
