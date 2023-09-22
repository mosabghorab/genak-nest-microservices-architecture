import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateFilterOption, DateFilterPayloadDto, DateHelpers, FindOneByIdPayloadDto, Product, ServiceType } from '@app/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find with total sales.
  async findWithTotalSales(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterPayloadDto) {
      if (dateFilterPayloadDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: dateFilterPayloadDto.startDate,
          endDate: dateFilterPayloadDto.endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterPayloadDto.dateFilterOption);
      }
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin(
        'product.orderItems',
        'orderItem',
        dateFilterPayloadDto?.dateFilterOption ? 'orderItem.createdAt BETWEEN :startDate AND :endDate' : null,
        dateFilterPayloadDto?.dateFilterOption
          ? {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }
          : null,
      )
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'total_sales')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['totalSales'] = parseFloat(raw[i]['total_sales']) || 0;
    }
    return entities;
  }

  // find with orders count.
  async findWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterPayloadDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterPayloadDto.startDate,
        endDate: dateFilterPayloadDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterPayloadDto.dateFilterOption);
    }
    const {
      entities,
      raw,
    }: {
      entities: Product[];
      raw: any[];
    } = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order', 'order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'orders_count')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['orders_count']) || 0;
    }
    return entities;
  }
}
