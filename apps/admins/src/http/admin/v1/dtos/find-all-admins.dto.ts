import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllAdminsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  page = 1;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  limit = 10;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  paginationEnable = true;
}
