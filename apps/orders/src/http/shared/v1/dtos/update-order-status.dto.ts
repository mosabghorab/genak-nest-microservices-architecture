import { IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '@app/common';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsNumber()
  @Transform(({ value, obj }) =>
    obj.status == OrderStatus.CANCELLED_BY_ADMIN || obj.status == OrderStatus.CANCELLED_BY_VENDOR || obj.status == OrderStatus.CANCELLED_BY_CUSTOMER || obj.status == OrderStatus.DECLINED
      ? parseInt(value)
      : null,
  )
  @ValidateIf(
    (obj) => obj.status == OrderStatus.CANCELLED_BY_ADMIN || obj.status == OrderStatus.CANCELLED_BY_VENDOR || obj.status == OrderStatus.CANCELLED_BY_CUSTOMER || obj.status == OrderStatus.DECLINED,
  )
  reasonId?: number;

  @IsString()
  @Transform(({ value, obj }) =>
    obj.status == OrderStatus.CANCELLED_BY_ADMIN || obj.status == OrderStatus.CANCELLED_BY_VENDOR || obj.status == OrderStatus.CANCELLED_BY_CUSTOMER || obj.status == OrderStatus.DECLINED
      ? value
      : null,
  )
  @ValidateIf(
    (obj) =>
      obj.reasonId == null &&
      (obj.status == OrderStatus.CANCELLED_BY_ADMIN || obj.status == OrderStatus.CANCELLED_BY_VENDOR || obj.status == OrderStatus.CANCELLED_BY_CUSTOMER || obj.status == OrderStatus.DECLINED),
  )
  note?: string;
}
