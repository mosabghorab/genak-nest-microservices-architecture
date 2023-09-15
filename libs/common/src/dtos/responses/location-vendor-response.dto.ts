import { Expose, Type } from 'class-transformer';
import { LocationResponseDto, VendorResponseDto } from '@app/common';

export class LocationVendorResponseDto {
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
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;

  @Expose()
  @Type(() => LocationResponseDto)
  location: LocationResponseDto;
}
