import { Expose, Type } from 'class-transformer';
import { CustomerResponseDto, LocationResponseDto, ProductResponseDto, VendorResponseDto } from '@app/common';

export class SalesReportsWithFilterResponseDto {
  @Expose()
  ordersCount: number;

  @Expose()
  totalSales: number;

  @Expose()
  customOrderItemsTotalSales: number;

  @Expose()
  customOrderItemsTotalQuantities: number;

  @Expose()
  @Type(() => LocationResponseDto)
  governoratesWithOrdersCount: LocationResponseDto[];

  @Expose()
  @Type(() => LocationResponseDto)
  regionsWithOrdersCount: LocationResponseDto[];

  @Expose()
  @Type(() => ProductResponseDto)
  productsWithTotalSales: ProductResponseDto[];

  @Expose()
  @Type(() => ProductResponseDto)
  productsWithOrdersCount: ProductResponseDto[];

  @Expose()
  @Type(() => VendorResponseDto)
  vendorsBestSellersWithOrdersCount: VendorResponseDto[];

  @Expose()
  @Type(() => CustomerResponseDto)
  customersBestBuyersWithOrdersCount: CustomerResponseDto[];
}
