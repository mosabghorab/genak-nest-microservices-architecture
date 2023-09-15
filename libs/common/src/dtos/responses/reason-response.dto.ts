import { Expose, Type } from 'class-transformer';
import { OrderStatusHistoryResponseDto } from '@app/common';

export class ReasonResponseDto {
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
  @Type(() => OrderStatusHistoryResponseDto)
  orderStatusHistories: OrderStatusHistoryResponseDto[];
}
