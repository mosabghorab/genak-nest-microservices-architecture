import { Expose, Type } from 'class-transformer';
import { LocationResponseDto } from '@app/common';

export class CustomersReportsResponseDto {
  @Expose()
  customersCount: number;

  @Expose()
  @Type(() => LocationResponseDto)
  governoratesWithCustomersCount: LocationResponseDto[];
}
