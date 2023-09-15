import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderItemRequestDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsNumber()
  quantity: number;
}
