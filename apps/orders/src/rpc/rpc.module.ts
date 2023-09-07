import { Module } from '@nestjs/common';
import { OrdersController } from './v1/controllers/orders.controller';
import { OrdersService } from './v1/services/orders.service';
import { DatabaseModule, Order } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Order])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class RpcModule {}
