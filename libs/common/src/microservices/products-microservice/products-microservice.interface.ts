import { Product } from '@app/common/entities';
import { DateFilterDto, FindOneByIdDto, FindOneOrFailByIdDto, ServiceType } from '@app/common';

export interface IProductsMicroservice {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Product>): Promise<Product | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Product>): Promise<Product>;

  // find with total sales.
  findWithTotalSales(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<Product[]>;

  // find with orders count.
  findWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Product[]>;
}
