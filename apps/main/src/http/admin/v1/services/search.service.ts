import { Inject, Injectable } from '@nestjs/common';
import {
  Admin,
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  Helpers,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  SearchPayloadDto,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { SearchRequestDto } from '../dtos/search-request.dto';

@Injectable()
export class SearchService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;

  constructor(
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
    @Inject(AdminsMicroserviceConstants.NAME)
    private readonly adminsMicroservice: ClientProxy,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
  }

  // search.
  search(searchRequestDto: SearchRequestDto): Promise<{
    executionTime: string;
    data: Promise<{ orders: Order[]; customers: Customer[]; vendors: Vendor[]; admins: Admin[] }>;
  }> {
    return Helpers.timerify<
      Promise<{
        orders: Order[];
        customers: Customer[];
        vendors: Vendor[];
        admins: Admin[];
      }>
    >(
      async (): Promise<{
        orders: Order[];
        customers: Customer[];
        vendors: Vendor[];
        admins: Admin[];
      }> => {
        const customers: Customer[] = await this.customersMicroserviceConnection.customersServiceImpl.searchByName(
          new SearchPayloadDto({
            searchQuery: searchRequestDto.searchQuery,
          }),
        );
        const vendors: Vendor[] = await this.vendorsMicroserviceConnection.vendorsServiceImpl.searchByName(
          new SearchPayloadDto({
            searchQuery: searchRequestDto.searchQuery,
          }),
        );
        const admins: Admin[] = await this.adminsMicroserviceConnection.adminsServiceImpl.searchByName(
          new SearchPayloadDto({
            searchQuery: searchRequestDto.searchQuery,
          }),
        );
        const orders: Order[] = await this.ordersMicroserviceConnection.ordersServiceImpl.searchByUniqueId(
          new SearchPayloadDto({
            searchQuery: searchRequestDto.searchQuery,
          }),
        );
        return { customers, vendors, admins, orders };
      },
    );
  }
}
