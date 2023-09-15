import { Expose, Type } from 'class-transformer';
import { ReviewResponseDto } from '@app/common';

export class AllReviewsResponseDto {
  @Expose()
  perPage: number;

  @Expose()
  currentPage: number;

  @Expose()
  lastPage: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => ReviewResponseDto)
  data: ReviewResponseDto[];
}
