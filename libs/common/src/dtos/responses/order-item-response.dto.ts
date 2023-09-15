import { Expose, Type } from 'class-transformer';
import { OrderResponseDto } from './order-response.dto';
import { ProductResponseDto } from '@app/common';

export class OrderItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  productId: number;

  @Expose()
  price: number;

  @Expose()
  productName: string;

  @Expose()
  quantity: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;

  @Expose()
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}
