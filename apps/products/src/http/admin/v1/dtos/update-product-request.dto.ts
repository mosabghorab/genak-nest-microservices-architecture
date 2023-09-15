import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  price?: number;

  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  active?: boolean;
}
