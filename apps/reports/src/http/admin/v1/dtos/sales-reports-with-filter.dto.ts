import { Expose, Type } from 'class-transformer';
import { CustomerDto, LocationDto, ProductDto, VendorDto } from '@app/common';

export class SalesReportsWithFilterDto {
  @Expose()
  ordersCount: number;

  @Expose()
  totalSales: number;

  @Expose()
  customOrderItemsTotalSales: number;

  @Expose()
  customOrderItemsTotalQuantities: number;

  @Expose()
  @Type(() => LocationDto)
  governoratesWithOrdersCount: LocationDto[];

  @Expose()
  @Type(() => LocationDto)
  regionsWithOrdersCount: LocationDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithTotalSales: ProductDto[];

  @Expose()
  @Type(() => ProductDto)
  productsWithOrdersCount: ProductDto[];

  @Expose()
  @Type(() => VendorDto)
  vendorsBestSellersWithOrdersCount: VendorDto[];

  @Expose()
  @Type(() => CustomerDto)
  customersBestBuyersWithOrdersCount: CustomerDto[];
}
