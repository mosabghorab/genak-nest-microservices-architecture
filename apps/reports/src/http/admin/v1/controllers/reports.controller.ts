import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import {
  AdminMustCanDo,
  AllowFor,
  AuthedUser,
  Customer,
  GetAuthedUser,
  Location,
  Order,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Product,
  Serialize,
  UserType,
  Vendor,
} from '@app/common';
import { VendorsReportsResponseDto } from '../dtos/vendors-reports-response.dto';
import { FindVendorsReportsRequestDto } from '../dtos/find-vendors-reports-request.dto';
import { CustomersReportsResponseDto } from '../dtos/customers-reports-response.dto';
import { SalesReportsResponseDto } from '../dtos/sales-reports-response.dto';
import { FindSalesReportsRequestDto } from '../dtos/find-sales-reports-request.dto';
import { SalesReportsWithFilterResponseDto } from '../dtos/sales-reports-with-filter-response.dto';
import { FindSalesReportsWithFilterRequestDto } from '../dtos/find-sales-reports-with-filter-request.dto';
import { GeneralReportsResponseDto } from '../dtos/general-reports-response.dto';
import { FindGeneralReportsRequestDto } from '../dtos/find-general-reports-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REPORTS)
@Controller({ path: 'admin/reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(GeneralReportsResponseDto, 'General reports.')
  @Get('general-reports')
  findGeneralReports(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findGeneralReportsRequestDto: FindGeneralReportsRequestDto,
  ): Promise<{
    latestVendors: Vendor[];
    ordersCount: number;
    governoratesWithVendorsAndCustomersAndOrdersCount: Location[];
    latestOrders: Order[];
    customersCount: number;
    vendorsCount: number;
    usersCount: number;
  }> {
    return this.reportsService.findGeneralReports(authedUser, findGeneralReportsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(VendorsReportsResponseDto, 'Vendors reports.')
  @Get('vendors-reports')
  findVendorsReports(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findVendorsReportsRequestDto: FindVendorsReportsRequestDto,
  ): Promise<{
    governoratesWithVendorsCount: Location[];
    documentsRequiredVendorsCount: number;
    pendingVendorsCount: number;
    activeVendorsCount: number;
  }> {
    return this.reportsService.findVendorsReports(authedUser, findVendorsReportsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(CustomersReportsResponseDto, 'Customers reports.')
  @Get('customers-reports')
  findCustomersReports(@GetAuthedUser() authedUser: AuthedUser): Promise<{
    customersCount: number;
    governoratesWithCustomersCount: Location[];
  }> {
    return this.reportsService.findCustomersReports(authedUser);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsResponseDto, 'Sales reports.')
  @Get('sales-reports')
  findSalesReports(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findSalesReportsRequestDto: FindSalesReportsRequestDto,
  ): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    totalSales: number;
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    return this.reportsService.findSalesReports(authedUser, findSalesReportsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SalesReportsWithFilterResponseDto, 'Sales reports with filter.')
  @Get('sales-reports-with-filter')
  findSalesReportsWithFilter(
    @GetAuthedUser() authedUser: AuthedUser,
    @Query() findSalesReportsWithFilterRequestDto: FindSalesReportsWithFilterRequestDto,
  ): Promise<{
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
    return this.reportsService.findSalesReportsWithFilter(authedUser, findSalesReportsWithFilterRequestDto);
  }
}
