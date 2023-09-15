import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLocationRequestDto {
  @IsString()
  name: string;

  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  parentId?: number;
}
