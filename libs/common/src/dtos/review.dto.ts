import { Expose, Type } from 'class-transformer';
import {
  ClientUserType,
  CustomerDto,
  OrderDto,
  ServiceType,
  VendorDto,
} from '@app/common';

export class ReviewDto {
  @Expose()
  id: number;

  @Expose()
  orderId: number;

  @Expose()
  customerId: number;

  @Expose()
  vendorId: number;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  reviewedBy: ClientUserType;

  @Expose()
  rate: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => OrderDto)
  order: OrderDto;

  @Expose()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;
}
