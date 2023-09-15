import { Controller } from '@nestjs/common';
import { DateFilterPayloadDto, FindOneByIdPayloadDto, FindOneOrderByIdAndServiceTypePayloadDto, Order, OrdersMicroserviceConstants, SearchPayloadDto, ServiceType } from '@app/common';
import { OrdersService } from '../services/orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindOptionsRelations } from 'typeorm';

const VERSION = '1';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return this.ordersService.findOneById(findOneByIdPayloadDto);
  }

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_SEARCH_BY_UNIQUE_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  searchByUniqueId(@Payload('searchPayloadDto') searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return this.ordersService.searchByUniqueId(searchPayloadDto);
  }

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByIdAndServiceType(@Payload('findOneOrderByIdAndServiceTypePayloadDto') findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null> {
    return this.ordersService.findOneByIdAndServiceType(findOneOrderByIdAndServiceTypePayloadDto);
  }

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(@Payload('serviceType') serviceType?: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number> {
    return this.ordersService.count(serviceType, dateFilterPayloadDto);
  }

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_TOTAL_SALES_MESSAGE_PATTERN}/v${VERSION}`,
  })
  totalSales(
    @Payload('serviceType') serviceType: ServiceType,
    @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
  }> {
    return this.ordersService.totalSales(serviceType, dateFilterPayloadDto);
  }

  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findLatest(@Payload('count') count: number, @Payload('serviceType') serviceType: ServiceType, @Payload('relations') relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return this.ordersService.findLatest(count, serviceType, relations);
  }
}
