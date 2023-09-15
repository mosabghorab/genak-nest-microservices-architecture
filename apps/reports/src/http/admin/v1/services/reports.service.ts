import { Inject, Injectable } from '@nestjs/common';
import {
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateFilterPayloadDto,
  Location,
  LocationsMicroserviceConnection,
  LocationsMicroserviceConstants,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  Product,
  ProductsMicroserviceConnection,
  ProductsMicroserviceConstants,
  ServiceType,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
  VendorStatus,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { FindVendorsReportsRequestDto } from '../dtos/find-vendors-reports-request.dto';
import { FindSalesReportsRequestDto } from '../dtos/find-sales-reports-request.dto';
import { FindSalesReportsWithFilterRequestDto } from '../dtos/find-sales-reports-with-filter-request.dto';
import { FindGeneralReportsRequestDto } from '../dtos/find-general-reports-request.dto';

@Injectable()
export class ReportsService {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly productsMicroserviceConnection: ProductsMicroserviceConnection;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
    @Inject(AdminsMicroserviceConstants.NAME)
    private readonly adminsMicroservice: ClientProxy,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(ProductsMicroserviceConstants.NAME)
    private readonly productsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.productsMicroserviceConnection = new ProductsMicroserviceConnection(productsMicroservice, Constants.PRODUCTS_MICROSERVICE_VERSION);
  }

  // find general reports.
  async findGeneralReports(findGeneralReportsRequestDto: FindGeneralReportsRequestDto): Promise<{
    latestVendors: Vendor[];
    ordersCount: number;
    governoratesWithVendorsAndCustomersAndOrdersCount: Location[];
    latestOrders: Order[];
    customersCount: number;
    vendorsCount: number;
    usersCount: number;
  }> {
    const customersCount: number = await this.customersMicroserviceConnection.customersServiceImpl.count();
    const adminsCount: number = await this.adminsMicroserviceConnection.adminsServiceImpl.count();
    const allVendorsCount: number = await this.vendorsMicroserviceConnection.vendorsServiceImpl.count();
    const vendorsCountByServiceType: number = await this.vendorsMicroserviceConnection.vendorsServiceImpl.count(findGeneralReportsRequestDto.serviceType);
    const ordersCount: number = await this.ordersMicroserviceConnection.ordersServiceImpl.count(findGeneralReportsRequestDto.serviceType);
    const governoratesWithVendorsAndCustomersAndOrdersCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findGovernoratesWithVendorsAndCustomersAndOrdersCount(
      findGeneralReportsRequestDto.serviceType,
    );
    const latestOrders: Order[] = await this.ordersMicroserviceConnection.ordersServiceImpl.findLatest(10, findGeneralReportsRequestDto.serviceType, {
      customer: true,
      vendor: true,
    });
    const latestVendors: Vendor[] = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findLatest(10, findGeneralReportsRequestDto.serviceType);
    return {
      usersCount: allVendorsCount + customersCount + adminsCount,
      customersCount,
      vendorsCount: vendorsCountByServiceType,
      ordersCount,
      governoratesWithVendorsAndCustomersAndOrdersCount,
      latestOrders,
      latestVendors,
    };
  }

  // find vendors reports.
  async findVendorsReports(findVendorsReportsRequestDto: FindVendorsReportsRequestDto): Promise<{
    governoratesWithVendorsCount: Location[];
    documentsRequiredVendorsCount: number;
    pendingVendorsCount: number;
    activeVendorsCount: number;
  }> {
    const documentsRequiredVendorsCount: number = await this.vendorsMicroserviceConnection.vendorsServiceImpl.count(findVendorsReportsRequestDto.serviceType, VendorStatus.DOCUMENTS_REQUIRED);
    const pendingVendorsCount: number = await this.vendorsMicroserviceConnection.vendorsServiceImpl.count(findVendorsReportsRequestDto.serviceType, VendorStatus.PENDING);
    const activeVendorsCount: number = await this.vendorsMicroserviceConnection.vendorsServiceImpl.count(findVendorsReportsRequestDto.serviceType, VendorStatus.ACTIVE);
    const governoratesWithVendorsCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findGovernoratesWithVendorsCount(findVendorsReportsRequestDto.serviceType);
    return {
      documentsRequiredVendorsCount,
      pendingVendorsCount,
      activeVendorsCount,
      governoratesWithVendorsCount,
    };
  }

  // find customers reports.
  async findCustomersReports(): Promise<{ customersCount: number; governoratesWithCustomersCount: Location[] }> {
    const customersCount: number = await this.customersMicroserviceConnection.customersServiceImpl.count();
    const governoratesWithCustomersCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findGovernoratesWithCustomersCount();
    return {
      customersCount,
      governoratesWithCustomersCount,
    };
  }

  // find sales reports.
  async findSalesReports(findSalesReportsRequestDto: FindSalesReportsRequestDto): Promise<{
    customOrderItemsTotalQuantities: number;
    ordersCount: number;
    totalSales: number;
    productsWithTotalSales: Product[];
    governoratesWithOrdersCount: Location[];
    customOrderItemsTotalSales: number;
  }> {
    const ordersCount: number = await this.ordersMicroserviceConnection.ordersServiceImpl.count(findSalesReportsRequestDto.serviceType);
    const totalSales: number = parseFloat((await this.ordersMicroserviceConnection.ordersServiceImpl.totalSales(findSalesReportsRequestDto.serviceType)).totalSales) || 0;
    const governoratesWithOrdersCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findGovernoratesWithOrdersCount(findSalesReportsRequestDto.serviceType);
    const productsWithTotalSales: Product[] = await this.productsMicroserviceConnection.productsServiceImpl.findWithTotalSales(findSalesReportsRequestDto.serviceType);
    let customOrderItemsTotalSales: number;
    let customOrderItemsTotalQuantities: number;
    if (findSalesReportsRequestDto.serviceType === ServiceType.WATER) {
      const {
        totalSales,
        totalQuantities,
      }: {
        totalSales: string;
        totalQuantities: string;
      } = await this.ordersMicroserviceConnection.orderItemsServiceImpl.findCustomOrderItemsTotalSalesAndQuantities();
      customOrderItemsTotalSales = parseFloat(totalSales) || 0;
      customOrderItemsTotalQuantities = parseInt(totalQuantities) || 0;
    }
    return {
      ordersCount,
      totalSales,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
    };
  }

  // find sales reports with filter.
  async findSalesReportsWithFilter(findSalesReportsWithFilterRequestDto: FindSalesReportsWithFilterRequestDto): Promise<{
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
    const ordersCount: number = await this.ordersMicroserviceConnection.ordersServiceImpl.count(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );
    const totalSales: number =
      parseFloat(
        (
          await this.ordersMicroserviceConnection.ordersServiceImpl.totalSales(
            findSalesReportsWithFilterRequestDto.serviceType,
            new DateFilterPayloadDto({
              dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
              startDate: findSalesReportsWithFilterRequestDto.startDate,
              endDate: findSalesReportsWithFilterRequestDto.endDate,
            }),
          )
        ).totalSales,
      ) || 0;

    const governoratesWithOrdersCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findGovernoratesWithOrdersCount(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );

    const regionsWithOrdersCount: Location[] = await this.locationsMicroserviceConnection.locationsServiceImpl.findRegionsWithOrdersCount(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );

    const productsWithTotalSales: Product[] = await this.productsMicroserviceConnection.productsServiceImpl.findWithTotalSales(findSalesReportsWithFilterRequestDto.serviceType, <DateFilterPayloadDto>{
      dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
      startDate: findSalesReportsWithFilterRequestDto.startDate,
      endDate: findSalesReportsWithFilterRequestDto.endDate,
    });
    const productsWithOrdersCount: Product[] = await this.productsMicroserviceConnection.productsServiceImpl.findWithOrdersCount(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );

    const vendorsBestSellersWithOrdersCount: Vendor[] = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findBestSellersWithOrdersCount(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );

    const customersBestBuyersWithOrdersCount: Customer[] = await this.customersMicroserviceConnection.customersServiceImpl.findBestBuyersWithOrdersCount(
      findSalesReportsWithFilterRequestDto.serviceType,
      new DateFilterPayloadDto({
        dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
        startDate: findSalesReportsWithFilterRequestDto.startDate,
        endDate: findSalesReportsWithFilterRequestDto.endDate,
      }),
    );
    let customOrderItemsTotalSales: number;
    let customOrderItemsTotalQuantities: number;
    if (findSalesReportsWithFilterRequestDto.serviceType === ServiceType.WATER) {
      const {
        totalSales,
        totalQuantities,
      }: {
        totalSales: string;
        totalQuantities: string;
      } = await this.ordersMicroserviceConnection.orderItemsServiceImpl.findCustomOrderItemsTotalSalesAndQuantities(
        new DateFilterPayloadDto({
          dateFilterOption: findSalesReportsWithFilterRequestDto.dateFilterOption,
          startDate: findSalesReportsWithFilterRequestDto.startDate,
          endDate: findSalesReportsWithFilterRequestDto.endDate,
        }),
      );
      customOrderItemsTotalSales = parseFloat(totalSales) || 0;
      customOrderItemsTotalQuantities = parseInt(totalQuantities) || 0;
    }
    return {
      ordersCount,
      totalSales,
      customOrderItemsTotalSales,
      customOrderItemsTotalQuantities,
      governoratesWithOrdersCount,
      productsWithTotalSales,
      regionsWithOrdersCount,
      productsWithOrdersCount,
      vendorsBestSellersWithOrdersCount,
      customersBestBuyersWithOrdersCount,
    };
  }
}
