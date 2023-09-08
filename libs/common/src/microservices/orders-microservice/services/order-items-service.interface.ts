import { DateFilterDto } from '@app/common';

export interface IOrderItemsService {
  // find custom order items total sales and quantities.
  findCustomOrderItemsTotalSalesAndQuantities(dateFilterDto?: DateFilterDto): Promise<{
    totalSales: string;
    totalQuantities: string;
  }>;
}
