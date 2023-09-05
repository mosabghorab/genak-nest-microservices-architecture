import { Expose, Type } from 'class-transformer';
import { LocationDto, VendorDto } from '@app/common';

export class LocationVendorDto {
  @Expose()
  id: number;

  @Expose()
  vendorId: number;

  @Expose()
  locationId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => VendorDto)
  vendor: VendorDto;

  @Expose()
  @Type(() => LocationDto)
  location: LocationDto;
}
