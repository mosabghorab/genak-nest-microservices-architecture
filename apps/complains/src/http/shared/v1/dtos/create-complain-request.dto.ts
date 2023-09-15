import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateComplainRequestDto {
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  orderId: number;

  @IsString()
  note: string;
}
