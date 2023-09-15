import { DateFilterPayloadDto, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Product, ServiceType } from '@app/common';

export interface IProductsService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Product>): Promise<Product>;

  // find with total sales.
  findWithTotalSales(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Product[]>;

  // find with orders count.
  findWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Product[]>;
}
