import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrderByIdAndServiceTypePayloadDto,
  FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  FindOneOrFailByIdPayloadDto,
  IOrdersService,
  Order,
  OrdersMicroserviceConstants,
  RpcAuthenticationPayloadDto,
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
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<
        Order,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(
      rpcAuthenticationPayloadDto,
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
  searchByUniqueId(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return firstValueFrom<Order[]>(
      this.ordersMicroservice.send<
        Order[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          searchPayloadDto: SearchPayloadDto<Order>;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_SEARCH_BY_UNIQUE_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          searchPayloadDto,
        },
      ),
    );
  }

  // find one by id and service type.
  findOneByIdAndServiceType(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null> {
    return firstValueFrom<Order>(
      this.ordersMicroservice.send<
        Order,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneOrderByIdAndServiceTypePayloadDto },
      ),
    );
  }

  // find one or fail by id and service type.
  async findOneOrFailByIdAndServiceType(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    findOneOrderOrFailByIdAndServiceTypePayloadDto: FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  ): Promise<Order> {
    const order: Order = await this.findOneByIdAndServiceType(
      rpcAuthenticationPayloadDto,
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
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType?: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number> {
    return firstValueFrom<number>(
      this.ordersMicroservice.send<
        number,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType?: ServiceType;
          dateFilterPayloadDto?: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }

  // find latest.
  findLatest(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return firstValueFrom<Order[]>(
      this.ordersMicroservice.send<
        Order[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          count: number;
          serviceType: ServiceType;
          relations?: FindOptionsRelations<Order>;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          count,
          serviceType,
          relations,
        },
      ),
    );
  }

  // total sales.
  totalSales(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    serviceType: ServiceType,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
  }> {
    return firstValueFrom<{ totalSales: string }>(
      this.ordersMicroservice.send<
        { totalSales: string },
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
          dateFilterPayloadDto?: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${OrdersMicroserviceConstants.ORDERS_SERVICE_TOTAL_SALES_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }
}
