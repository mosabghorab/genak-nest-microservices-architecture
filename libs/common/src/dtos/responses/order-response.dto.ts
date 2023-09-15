import { Expose, Type } from 'class-transformer';
import {
  ComplainResponseDto,
  CustomerAddressDto,
  CustomerResponseDto,
  OrderItemResponseDto,
  OrderStatus,
  OrderStatusHistoryResponseDto,
  ReviewResponseDto,
  ServiceType,
  VendorResponseDto,
} from '@app/common';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  uniqueId: number;

  @Expose()
  customerId: number;

  @Expose()
  vendorId: number;

  @Expose()
  customerAddressId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  status: OrderStatus;

  @Expose()
  note: string;

  @Expose()
  total: number;

  @Expose()
  startTime: Date;

  @Expose()
  endTime: Date;

  @Expose()
  averageTimeMinutes: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @Expose()
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;

  @Expose()
  @Type(() => CustomerAddressDto)
  customerAddress: CustomerAddressDto;

  @Expose()
  @Type(() => OrderItemResponseDto)
  orderItems: OrderItemResponseDto[];

  @Expose()
  @Type(() => OrderStatusHistoryResponseDto)
  orderStatusHistories: OrderStatusHistoryResponseDto[];

  @Expose()
  @Type(() => ReviewResponseDto)
  reviews: ReviewResponseDto[];

  @Expose()
  @Type(() => ComplainResponseDto)
  complains: ComplainResponseDto[];
}
