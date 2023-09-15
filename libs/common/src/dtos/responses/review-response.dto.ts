import { Expose, Type } from 'class-transformer';
import { ClientUserType, CustomerResponseDto, OrderResponseDto, ServiceType, VendorResponseDto } from '@app/common';

export class ReviewResponseDto {
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
  @Type(() => OrderResponseDto)
  order: OrderResponseDto;

  @Expose()
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @Expose()
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;
}
