import { Expose, Type } from 'class-transformer';
import { CustomerDto, LocationVendorDto, VendorDto } from '@app/common';

export class LocationDto {
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
  @Type(() => LocationDto)
  parent: LocationDto;

  @Expose()
  @Type(() => LocationDto)
  locations: LocationDto[];

  @Expose()
  @Type(() => VendorDto)
  vendors: VendorDto[];

  @Expose()
  @Type(() => LocationVendorDto)
  locationsVendors: LocationVendorDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersByGovernorate: CustomerDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersByRegion: CustomerDto[];

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
