import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemRequestDto } from './create-order-item-request.dto';
import { ServiceType } from '@app/common';

export class CreateOrderRequestDto {
  @IsNumber()
  vendorId: number;

  @IsNumber()
  customerAddressId: number;

  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  total: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  orderItems: CreateOrderItemRequestDto[];
}
