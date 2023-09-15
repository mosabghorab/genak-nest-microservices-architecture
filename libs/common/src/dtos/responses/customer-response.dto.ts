import { Expose, Type } from 'class-transformer';
import { LocationResponseDto } from './location-response.dto';
import { OrderResponseDto } from './order-response.dto';
import { ReviewResponseDto } from './review-response.dto';
import { CustomerAddressDto, CustomerStatus } from '@app/common';

export class CustomerResponseDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  status: CustomerStatus;

  @Expose()
  governorateId: number;

  @Expose()
  regionId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => LocationResponseDto)
  governorate: LocationResponseDto;

  @Expose()
  @Type(() => LocationResponseDto)
  region: LocationResponseDto;

  @Expose()
  @Type(() => CustomerAddressDto)
  customerAddresses: CustomerAddressDto[];

  @Expose()
  @Type(() => OrderResponseDto)
  orders: OrderResponseDto[];

  @Expose()
  @Type(() => ReviewResponseDto)
  reviews: ReviewResponseDto[];

  // extra fields.
  @Expose()
  accessToken: string;

  @Expose()
  ordersCount: number;
}
