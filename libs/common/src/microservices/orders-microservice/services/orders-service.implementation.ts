import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrderByIdAndServiceTypePayloadDto,
  FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  FindOneOrFailByIdPayloadDto,
  IOrdersService,
  Order,
  OrdersMicroserviceConstants,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';

export class OrdersServiceImpl implements IOrdersService {
  constructor(private readonly ordersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<Order, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Order> }>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(
      new FindOneByIdPayloadDto<Order>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!order) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // search by name.
  searchByUniqueId(searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return firstValueFrom<Order[]>(
      this.ordersMicroservice.send<Order[], { searchPayloadDto: SearchPayloadDto<Order> }>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_SEARCH_BY_UNIQUE_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          searchPayloadDto,
        },
      ),
    );
  }

  // find one by id and service type.
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<
        Order,
        {
          findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneOrderByIdAndServiceTypePayloadDto },
      ),
    );
  }

  // find one or fail by id and service type.
  async findOneOrFailByIdAndServiceType(findOneOrderOrFailByIdAndServiceTypePayloadDto: FindOneOrderOrFailByIdAndServiceTypePayloadDto): Promise<Order> {
    const order: Order = await this.findOneByIdAndServiceType(
      new FindOneOrderByIdAndServiceTypePayloadDto({
        id: findOneOrderOrFailByIdAndServiceTypePayloadDto.id,
        relations: findOneOrderOrFailByIdAndServiceTypePayloadDto.relations,
        serviceType: findOneOrderOrFailByIdAndServiceTypePayloadDto.serviceType,
      }),
    );
    if (!order) {
      throw new NotFoundException(findOneOrderOrFailByIdAndServiceTypePayloadDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // count.
  count(serviceType?: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number> {
    return firstValueFrom<number>(
      this.ordersMicroservice.send<number, { serviceType?: ServiceType; dateFilterPayloadDto?: DateFilterPayloadDto }>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return firstValueFrom<Order[]>(
      this.ordersMicroservice.send<
        Order[],
        {
          count: number;
          serviceType: ServiceType;
          relations?: FindOptionsRelations<Order>;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          count,
          serviceType,
          relations,
        },
      ),
    );
  }

  // total sales.
  totalSales(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<{ totalSales: string }> {
    return firstValueFrom<{ totalSales: string }>(
      this.ordersMicroservice.send<
        { totalSales: string },
        {
          serviceType: ServiceType;
          dateFilterPayloadDto?: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_TOTAL_SALES_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }
}
