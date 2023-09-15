import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrderByIdAndServiceTypePayloadDto,
  FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';
import { FindOptionsRelations } from 'typeorm';

export interface IOrdersService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order>;

  // search by unique id.
  searchByUniqueId(searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]>;

  // find one by id and service type.
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null>;

  // find one or fail by id and service type.
  findOneOrFailByIdAndServiceType(findOneOrderOrFailByIdAndServiceTypePayloadDto: FindOneOrderOrFailByIdAndServiceTypePayloadDto): Promise<Order>;

  // count.
  count(serviceType?: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number>;

  // total sales.
  totalSales(
    serviceType: ServiceType,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
  }>;

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]>;
}
