import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewRequestDto {
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  orderId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  customerId: number;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  rate: number;
}
