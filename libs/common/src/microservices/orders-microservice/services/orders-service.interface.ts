import { DateFilterDto, FindOneByIdDto, FindOneOrderByIdAndServiceTypeDto, FindOneOrderOrFailByIdAndServiceTypeDto, FindOneOrFailByIdDto, Order, SearchPayloadDto, ServiceType } from '@app/common';
import { FindOptionsRelations } from 'typeorm';

export interface IOrdersService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Order>): Promise<Order>;

  // search by unique id.
  searchByUniqueId(searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]>;

  // find one by id and service type.
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypeDto: FindOneOrderByIdAndServiceTypeDto): Promise<Order | null>;

  // find one or fail by id and service type.
  findOneOrFailByIdAndServiceType(findOneOrderOrFailByIdAndServiceTypeDto: FindOneOrderOrFailByIdAndServiceTypeDto): Promise<Order>;

  // count.
  count(serviceType?: ServiceType, dateFilterDto?: DateFilterDto): Promise<number>;

  // total sales.
  totalSales(
    serviceType: ServiceType,
    dateFilterDto?: DateFilterDto,
  ): Promise<{
    totalSales: string;
  }>;

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]>;
}
