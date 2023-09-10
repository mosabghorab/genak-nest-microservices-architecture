import { Expose, Type } from 'class-transformer';
import { OrderDto } from '@app/common';

export class AllOrdersDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => OrderDto)
  data: OrderDto[];
}
