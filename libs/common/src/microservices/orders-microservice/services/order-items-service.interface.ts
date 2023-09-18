import { DateFilterPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';

export interface IOrderItemsService {
  // find custom order items total sales and quantities.
  findCustomOrderItemsTotalSalesAndQuantities(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
    totalQuantities: string;
  }>;
}
