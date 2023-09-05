import { Expose, Type } from 'class-transformer';
import { OrderItemDto, ServiceType } from '@app/common';

export class ProductDto {
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
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  // extra fields.
  @Expose()
  totalSales: number;

  @Expose()
  ordersCount: number;
}
