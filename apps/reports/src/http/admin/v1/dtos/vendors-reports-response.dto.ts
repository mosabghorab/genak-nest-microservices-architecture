import { Expose, Type } from 'class-transformer';
import { LocationResponseDto } from '@app/common';

export class VendorsReportsResponseDto {
  @Expose()
  documentsRequiredVendorsCount: number;

  @Expose()
  pendingVendorsCount: number;

  @Expose()
  activeVendorsCount: number;

  @Expose()
  @Type(() => LocationResponseDto)
  governoratesWithVendorsCount: LocationResponseDto[];
}
