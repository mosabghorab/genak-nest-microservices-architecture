import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllLocationsRequestDto {
  @IsOptional()
  @Transform(({ value }): number => parseInt(value))
  @IsNumber()
  parentId?: number;
}
