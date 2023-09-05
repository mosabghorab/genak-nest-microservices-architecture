import { Expose, Type } from 'class-transformer';
import { OrderDto, OrderStatus, ReasonDto } from '@app/common';

export class OrderStatusHistoryDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  reasonId: number;

  @Expose()
  orderStatus: OrderStatus;

  @Expose()
  note: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => ReasonDto)
  reason: ReasonDto;
}
