import {
  DateFilterDto,
  FindOneByIdDto,
  FindOneOrderByIdAndServiceTypeDto,
  FindOneOrderOrFailByIdAndServiceTypeDto,
  FindOneOrFailByIdDto,
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
    const order: Order = await this.findOneById(<FindOneByIdDto<Order>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!order) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Order not found.');
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
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypeDto: FindOneOrderByIdAndServiceTypeDto): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<Order, FindOneOrderByIdAndServiceTypeDto>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneOrderByIdAndServiceTypeDto,
      ),
    );
  }

  // find one or fail by id and service type.
  async findOneOrFailByIdAndServiceType(findOneOrderOrFailByIdAndServiceTypeDto: FindOneOrderOrFailByIdAndServiceTypeDto): Promise<Order> {
    const order: Order = await this.findOneByIdAndServiceType(<FindOneOrderByIdAndServiceTypeDto>{
      id: findOneOrderOrFailByIdAndServiceTypeDto.id,
      relations: findOneOrderOrFailByIdAndServiceTypeDto.relations,
      serviceType: findOneOrderOrFailByIdAndServiceTypeDto.serviceType,
    });
    if (!order) {
      throw new NotFoundException(findOneOrderOrFailByIdAndServiceTypeDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // count.
  count(serviceType?: ServiceType, dateFilterDto?: DateFilterDto): Promise<number> {
    return firstValueFrom<number>(
      this.ordersMicroservice.send<number, { serviceType?: ServiceType; dateFilterDto?: DateFilterDto }>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
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
  totalSales(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<{ totalSales: string }> {
    return firstValueFrom<{ totalSales: string }>(
      this.ordersMicroservice.send<{ totalSales: string }, { serviceType: ServiceType; dateFilterDto?: DateFilterDto }>(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_TOTAL_SALES_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
        },
      ),
    );
  }
}
