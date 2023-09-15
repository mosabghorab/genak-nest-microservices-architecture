import { Expose, Type } from 'class-transformer';
import { AdminResponseDto } from '@app/common';

export class AllAdminsResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => AdminResponseDto)
  data: AdminResponseDto[];
}
