import { Expose, Type } from 'class-transformer';
import { OrderItemResponseDto, ServiceType } from '@app/common';

export class ProductResponseDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  price: number;

  @Expose()
  size: number;

  @Expose()
  image: string;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => OrderItemResponseDto)
  orderItems: OrderItemResponseDto[];

  // extra fields.
  @Expose()
  totalSales: number;

  @Expose()
  ordersCount: number;
}
