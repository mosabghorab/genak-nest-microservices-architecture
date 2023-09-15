import { Expose, Type } from 'class-transformer';
import { LocationResponseDto, OrderResponseDto, VendorResponseDto } from '@app/common';

export class GeneralReportsResponseDto {
  @Expose()
  usersCount: number;

  @Expose()
  customersCount: number;

  @Expose()
  vendorsCount: number;

  @Expose()
  ordersCount: number;

  @Expose()
  @Type(() => LocationResponseDto)
  governoratesWithVendorsAndCustomersAndOrdersCount: LocationResponseDto[];

  @Expose()
  @Type(() => OrderResponseDto)
  latestOrders: OrderResponseDto[];

  @Expose()
  @Type(() => VendorResponseDto)
  latestVendors: VendorResponseDto[];
}
