import { ClientProxy } from '@nestjs/microservices';
import { OrdersServiceImpl } from '@app/common/microservices';

export class OrdersMicroserviceConnection {
  public readonly ordersServiceImpl: OrdersServiceImpl;

  constructor(private readonly ordersMicroservice: ClientProxy, private readonly version: string) {
    this.ordersServiceImpl = new OrdersServiceImpl(ordersMicroservice, version);
  }
}
