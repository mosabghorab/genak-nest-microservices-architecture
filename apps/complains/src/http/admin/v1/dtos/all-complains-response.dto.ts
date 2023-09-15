import { Expose, Type } from 'class-transformer';
import { ComplainResponseDto } from '@app/common';

export class AllComplainsResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => ComplainResponseDto)
  data: ComplainResponseDto[];
}
