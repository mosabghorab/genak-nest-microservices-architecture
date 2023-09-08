import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { AdminMustCanDo, AllowFor, Customer, Location, Order, PermissionAction, PermissionGroup, PermissionsTarget, Product, Serialize, UserType, Vendor } from '@app/common';
import { VendorsReportsDto } from '../dtos/vendors-reports.dto';
import { FindVendorsReportsDto } from '../dtos/find-vendors-reports.dto';
import { CustomersReportsDto } from '../dtos/customers-reports.dto';
import { SalesReportsDto } from '../dtos/sales-reports.dto';
import { FindSalesReportsDto } from '../dtos/find-sales-reports.dto';
import { SalesReportsWithFilterDto } from '../dtos/sales-reports-with-filter.dto';
import { FindSalesReportsWithFilterDto } from '../dtos/find-sales-reports-with-filter.dto';
import { GeneralReportsDto } from '../dtos/general-reports.dto';
import { FindGeneralReportsDto } from '../dtos/find-general-reports.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REPORTS)
@Controller({ path: 'admin/reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(GeneralReportsDto, 'General reports.')
  @Get('general-reports')
  findGeneralReports(@Query() findGeneralReportsDto: FindGeneralReportsDto): Promise<{
    latestVendors: Vendor[];
    ordersCount: number;
    governoratesWithVendorsAndCustomersAndOrdersCount: Location[];
    latestOrders: Order[];
    customersCount: number;
    vendorsCount: number;
    usersCount: number;
  }> {
    return this.reportsService.findGeneralReports(findGeneralReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorsReportsDto, 'Vendors reports.')
  @Get('vendors-reports')
  findVendorsReports(@Query() findVendorsReportsDto: FindVendorsReportsDto): Promise<{
    governoratesWithVendorsCount: Location[];
    documentsRequiredVendorsCount: number;
    pendingVendorsCount: number;
    activeVendorsCount: number;
  }> {
    return this.reportsService.findVendorsReports(findVendorsReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersReportsDto, 'Customers reports.')
  @Get('customers-reports')
  findCustomersReports(): Promise<{ customersCount: number; governoratesWithCustomersCount: Location[] }> {
    return this.reportsService.findCustomersReports();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsDto, 'Sales reports.')
  @Get('sales-reports')
  findSalesReports(@Query() findSalesReportsDto: FindSalesReportsDto): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    totalSales: number;
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    return this.reportsService.findSalesReports(findSalesReportsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsWithFilterDto, 'Sales reports with filter.')
  @Get('sales-reports-with-filter')
  findSalesReportsWithFilter(@Query() findSalesReportsWithFilterDto: FindSalesReportsWithFilterDto): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    vendorsBestSellersWithOrdersCount: Vendor[];
    customersBestBuyersWithOrdersCount: Customer[];
    productsWithOrdersCount: Product[];
    totalSales: number;
    regionsWithOrdersCount: Location[];
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    return this.reportsService.findSalesReportsWithFilter(findSalesReportsWithFilterDto);
  }
}
