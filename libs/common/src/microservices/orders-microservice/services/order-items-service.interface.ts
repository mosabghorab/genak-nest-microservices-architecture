import { DateFilterPayloadDto } from '@app/common';

export interface IOrderItemsService {
  // find custom order items total sales and quantities.
  findCustomOrderItemsTotalSalesAndQuantities(dateFilterPayloadDto?: DateFilterPayloadDto): Promise<{
    totalSales: string;
    totalQuantities: string;
  }>;
}
