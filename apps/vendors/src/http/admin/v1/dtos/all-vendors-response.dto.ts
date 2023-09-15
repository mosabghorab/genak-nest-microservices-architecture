import { Expose, Type } from 'class-transformer';
import { VendorResponseDto } from '@app/common';

export class AllVendorsResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => VendorResponseDto)
  data: VendorResponseDto[];
}
