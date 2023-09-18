import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrderByIdAndServiceTypePayloadDto,
  FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';
import { FindOptionsRelations } from 'typeorm';

export interface IOrdersService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order>;

  // search by unique id.
  searchByUniqueId(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]>;

  // find one by id and service type.
  findOneByIdAndServiceType(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null>;

  // find one or fail by id and service type.
  findOneOrFailByIdAndServiceType(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    findOneOrderOrFailByIdAndServiceTypePayloadDto: FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  ): Promise<Order>;

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType?: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number>;

  // total sales.
  totalSales(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    serviceType: ServiceType,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
  }>;

  // find latest.
  findLatest(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]>;
}
