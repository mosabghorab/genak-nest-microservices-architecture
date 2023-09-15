import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto, LocationVendorResponseDto, VendorResponseDto } from '@app/common';

export class LocationResponseDto {
  // entity fields.
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  parentId: number;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // entity relations fields.
  @Expose()
  @Type(() => LocationResponseDto)
  parent: LocationResponseDto;

  @Expose()
  @Type(() => LocationResponseDto)
  locations: LocationResponseDto[];

  @Expose()
  @Type(() => VendorResponseDto)
  vendors: VendorResponseDto[];

  @Expose()
  @Type(() => LocationVendorResponseDto)
  locationsVendors: LocationVendorResponseDto[];

  @Expose()
  @Type(() => CustomerResponseDto)
  customersByGovernorate: CustomerResponseDto[];

  @Expose()
  @Type(() => CustomerResponseDto)
  customersByRegion: CustomerResponseDto[];

  // extra fields.
  @Expose()
  vendorsCount: number;

  @Expose()
  customersCount: number;

  @Expose()
  ordersCount: number;

  @Expose()
  documentsRequiredVendorsCount: number;

  @Expose()
  pendingVendorsCount: number;

  @Expose()
  activeVendorsCount: number;
}
