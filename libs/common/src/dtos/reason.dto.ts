import { Expose, Type } from 'class-transformer';
import { OrderStatusHistoryDto } from '@app/common';

export class ReasonDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderStatusHistoryDto)
  orderStatusHistories: OrderStatusHistoryDto[];
}
