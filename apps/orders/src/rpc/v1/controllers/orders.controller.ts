import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Order, OrdersMicroserviceConstants } from '@app/common';
import { OrdersService } from '../services/orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null> {
    return this.ordersService.findOneById(findOneByIdDto);
  }
}
