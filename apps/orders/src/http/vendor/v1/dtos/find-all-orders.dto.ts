import { IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@app/common';

export class FindAllOrdersDto {
  @IsOptional()
  @IsArray()
  @Transform(({ value }): any => JSON.parse(value))
  statuses?: OrderStatus[] = Object.values(OrderStatus);
}
