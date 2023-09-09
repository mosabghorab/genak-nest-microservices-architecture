import { Expose, Type } from 'class-transformer';
import { OrderDto } from '@app/common';

export class VendorOrdersPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;
  Find;
  @Expose()
  ordersTotalPrice: number;

  @Expose()
  ordersAverageTimeMinutes: number;

  @Expose()
  @Type(() => OrderDto)
  data: OrderDto[];
}
