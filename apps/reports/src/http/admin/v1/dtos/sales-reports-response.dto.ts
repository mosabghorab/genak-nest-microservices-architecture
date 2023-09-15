import { Expose, Type } from 'class-transformer';
import { LocationResponseDto, ProductResponseDto } from '@app/common';

export class SalesReportsResponseDto {
  @Expose()
  ordersCount: number;

  @Expose()
  totalSales: number;

  @Expose()
  customOrderItemsTotalSales: number;

  @Expose()
  customOrderItemsTotalQuantities: number;

  @Expose()
  @Type(() => LocationResponseDto)
  governoratesWithOrdersCount: LocationResponseDto[];

  @Expose()
  @Type(() => ProductResponseDto)
  productsWithTotalSales: ProductResponseDto[];
}
