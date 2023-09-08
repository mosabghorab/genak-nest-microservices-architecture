import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DateFilterDto, DateFilterOption, DateHelpers, OrderItem } from '@app/common';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // find custom order items total sales and quantities.
  async findCustomOrderItemsTotalSalesAndQuantities(dateFilterDto?: DateFilterDto): Promise<{
    totalSales: string;
    totalQuantities: string;
  }> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterDto) {
      if (dateFilterDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: dateFilterDto.startDate,
          endDate: dateFilterDto.endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterDto.dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<OrderItem> = this.orderItemRepository
      .createQueryBuilder('orderItem')
      .select(['SUM(orderItem.price) AS totalSales', 'SUM(orderItem.quantity) AS totalQuantities'])
      .where('orderItem.productId IS NULL');
    if (dateFilterDto) {
      queryBuilder.andWhere('orderItem.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    return queryBuilder.getRawOne();
  }
}
