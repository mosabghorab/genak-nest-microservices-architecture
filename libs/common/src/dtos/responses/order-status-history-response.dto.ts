import { Expose, Type } from 'class-transformer';
import { OrderResponseDto, OrderStatus, ReasonResponseDto } from '@app/common';

export class OrderStatusHistoryResponseDto {
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
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;

  @Expose()
  @Type(() => ReasonResponseDto)
  reason: ReasonResponseDto;
}
