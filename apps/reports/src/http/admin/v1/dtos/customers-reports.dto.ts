import { Expose, Type } from 'class-transformer';
import { LocationDto } from '@app/common';

export class CustomersReportsDto {
  @Expose()
  customersCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithCustomersCount: LocationDto[];
}
