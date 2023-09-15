import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from '@app/common';

export class AllVendorOrdersResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  ordersTotalPrice: number;

  @Expose()
  ordersAverageTimeMinutes: number;

  @Expose()
  @Type(() => OrderResponseDto)
  data: OrderResponseDto[];
}
