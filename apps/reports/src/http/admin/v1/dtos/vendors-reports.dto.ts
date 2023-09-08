import { Expose, Type } from 'class-transformer';
import { LocationDto } from '@app/common';

export class VendorsReportsDto {
  @Expose()
  documentsRequiredVendorsCount: number;

  @Expose()
  pendingVendorsCount: number;

  @Expose()
  activeVendorsCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithVendorsCount: LocationDto[];
}
