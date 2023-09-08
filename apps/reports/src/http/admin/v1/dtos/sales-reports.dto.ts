import { Expose, Type } from 'class-transformer';
import { LocationDto, ProductDto } from '@app/common';

export class SalesReportsDto {
  @Expose()
  ordersCount: number;

  @Expose()
  totalSales: number;

  @Expose()
  customOrderItemsTotalSales: number;

  @Expose()
  customOrderItemsTotalQuantities: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithOrdersCount: LocationDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithTotalSales: ProductDto[];
}
