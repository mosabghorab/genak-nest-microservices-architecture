import { Expose, Type } from 'class-transformer';
import { AttachmentResponseDto, LocationResponseDto, LocationVendorResponseDto, OrderResponseDto, ReviewResponseDto, ServiceType, VendorStatus } from '@app/common';

export class VendorResponseDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  commercialName: string;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  governorateId: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  avatar: string;

  @Expose()
  maxProducts: number;

  @Expose()
  maxOrders: number;

  @Expose()
  notificationsEnabled: boolean;

  @Expose()
  available: boolean;

  @Expose()
  status: VendorStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => LocationResponseDto)
  governorate: LocationResponseDto;

  @Expose()
  @Type(() => LocationVendorResponseDto)
  locationsVendors: LocationVendorResponseDto[];

  @Expose()
  @Type(() => OrderResponseDto)
  orders: OrderResponseDto[];

  @Expose()
  @Type(() => ReviewResponseDto)
  reviews: ReviewResponseDto[];

  @Expose()
  @Type(() => AttachmentResponseDto)
  attachments: AttachmentResponseDto[];

  // extra fields.
  @Expose()
  accessToken: string;

  @Expose()
  ordersCount: number;

  @Expose()
  averageTimeMinutes: number;

  @Expose()
  averageRate: number;

  @Expose()
  reviewsCount: number;
}
