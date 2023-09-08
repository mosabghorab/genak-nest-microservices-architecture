import { ClientProxy } from '@nestjs/microservices';
import { OrderItemsServiceImpl, OrdersServiceImpl } from '@app/common/microservices';

export class OrdersMicroserviceConnection {
  public readonly ordersServiceImpl: OrdersServiceImpl;
  public readonly orderItemsServiceImpl: OrderItemsServiceImpl;

  constructor(private readonly ordersMicroservice: ClientProxy, private readonly version: string) {
    this.ordersServiceImpl = new OrdersServiceImpl(ordersMicroservice, version);
    this.orderItemsServiceImpl = new OrderItemsServiceImpl(ordersMicroservice, version);
  }
}
