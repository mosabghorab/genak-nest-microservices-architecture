import { Expose, Type } from 'class-transformer';
import { LocationDto, OrderDto, VendorDto } from '@app/common';

export class GeneralReportsDto {
  @Expose()
  usersCount: number;

  @Expose()
  customersCount: number;

  @Expose()
  vendorsCount: number;

  @Expose()
  ordersCount: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithVendorsAndCustomersAndOrdersCount: LocationDto[];

  @Expose()
  @Type(() => OrderDto)
  latestOrders: OrderDto[];

  @Expose()
  @Type(() => VendorDto)
  latestVendors: VendorDto[];
}
