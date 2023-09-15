import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto } from '@app/common';

export class AllCustomersResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => CustomerResponseDto)
  data: CustomerResponseDto[];
}
