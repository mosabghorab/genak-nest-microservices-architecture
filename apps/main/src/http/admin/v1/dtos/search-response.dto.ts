import { Expose, Type } from 'class-transformer';
import { AdminResponseDto, CustomerResponseDto, OrderResponseDto, VendorResponseDto } from '@app/common';

class DataDto {
  @Expose()
  @Type(() => CustomerResponseDto)
  customers: CustomerResponseDto[];

  @Expose()
  @Type(() => VendorResponseDto)
  vendors: VendorResponseDto[];

  @Expose()
  @Type(() => AdminResponseDto)
  admins: AdminResponseDto[];

  @Expose()
  @Type(() => OrderResponseDto)
  orders: OrderResponseDto[];
}

export class SearchResponseDto {
  @Expose()
  executionTime: string;

  @Expose()
  @Type(() => DataDto)
  data: DataDto;
}
