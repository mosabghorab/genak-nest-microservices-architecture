import { Expose, Type } from 'class-transformer';
import { AdminDto, CustomerDto, OrderDto, VendorDto } from '@app/common';

export class SearchResponseDto {
  @Expose()
  @Type(() => CustomerDto)
  customers: CustomerDto[];

  @Expose()
  @Type(() => VendorDto)
  vendors: VendorDto[];

  @Expose()
  @Type(() => AdminDto)
  admins: AdminDto[];

  @Expose()
  @Type(() => OrderDto)
  orders: OrderDto[];
}
