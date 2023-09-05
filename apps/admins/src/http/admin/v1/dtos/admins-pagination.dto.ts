import { Expose, Type } from 'class-transformer';
import { AdminDto } from '@app/common';

export class AdminsPaginationDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => AdminDto)
  data: AdminDto[];
}
