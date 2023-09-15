import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from '@app/common';

export class CustomerAddressDto {
  @Expose()
  id: number;

  @Expose()
  onMapName: string;

  @Expose()
  label: string;

  @Expose()
  description: string;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  @Type(() => CustomerResponseDto)
  customer: CustomerResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
