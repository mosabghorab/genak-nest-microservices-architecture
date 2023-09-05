import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllCustomersDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  limit = 10;
}
