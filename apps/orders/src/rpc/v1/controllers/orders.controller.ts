import { Controller, UseGuards } from '@nestjs/common';
import {
  AllowFor,
  AuthGuard,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrderByIdAndServiceTypePayloadDto,
  Order,
  OrdersMicroserviceConstants,
  SearchPayloadDto,
  ServiceType,
  SkipAdminRoles,
  UserType,
} from '@app/common';
import { OrdersService } from '../services/orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindOptionsRelations } from 'typeorm';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return this.ordersService.findOneById(findOneByIdPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_SEARCH_BY_UNIQUE_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  searchByUniqueId(@Payload('searchPayloadDto') searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return this.ordersService.searchByUniqueId(searchPayloadDto);
  }

  @AllowFor(UserType.VENDOR)
  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByIdAndServiceType(@Payload('findOneOrderByIdAndServiceTypePayloadDto') findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null> {
    return this.ordersService.findOneByIdAndServiceType(findOneOrderByIdAndServiceTypePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(@Payload('serviceType') serviceType?: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number> {
    return this.ordersService.count(serviceType, dateFilterPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
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

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findLatest(@Payload('count') count: number, @Payload('serviceType') serviceType: ServiceType, @Payload('relations') relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return this.ordersService.findLatest(count, serviceType, relations);
  }
}
