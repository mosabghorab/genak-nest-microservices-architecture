import { FindOneByIdDto, FindOneOrFailByIdDto, IOrdersService, Order, OrdersMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class OrdersServiceImpl implements IOrdersService {
  constructor(private readonly ordersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<Order, FindOneByIdDto<Order>>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Order>): Promise<Order> {
    const order: Order = await firstValueFrom<Order>(
      this.ordersMicroservice.send<Order, FindOneByIdDto<Order>>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByIdDto<Order>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!order) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Order not found.');
    }
    return order;
  }
}
