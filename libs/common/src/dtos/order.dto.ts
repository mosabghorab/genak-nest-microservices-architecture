import { Expose, Type } from 'class-transformer';
import {
  ComplainDto,
  CustomerAddressDto,
  CustomerDto,
  OrderItemDto,
  OrderStatus,
  OrderStatusHistoryDto,
  ReviewDto,
  ServiceType,
  VendorDto,
} from '@app/common';

export class OrderDto {
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
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;

  @Expose()
  @Type(() => CustomerAddressDto)
  customerAddress: CustomerAddressDto;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  @Type(() => OrderStatusHistoryDto)
  orderStatusHistories: OrderStatusHistoryDto[];

  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @Expose()
  @Type(() => ComplainDto)
  complains: ComplainDto[];
}
