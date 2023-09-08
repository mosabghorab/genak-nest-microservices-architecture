import { Module } from '@nestjs/common';
import { OrdersController } from './v1/controllers/orders.controller';
import { OrdersService } from './v1/services/orders.service';
import { DatabaseModule, Order, OrderItem } from '@app/common';
import { OrderItemsController } from './v1/controllers/order-items.controller';
import { OrderItemService } from './v1/services/order-item.service';

@Module({
  imports: [DatabaseModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController, OrderItemsController],
  providers: [OrdersService, OrderItemService],
})
export class RpcModule {}
