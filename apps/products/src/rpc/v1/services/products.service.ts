import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateFilterDto, DateFilterOption, DateHelpers, FindOneByIdDto, Product, ServiceType } from '@app/common';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Product>): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find with total sales.
  async findWithTotalSales(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<Product[]> {
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
        dateFilterDto?.dateFilterOption ? 'orderItem.createdAt BETWEEN :startDate AND :endDate' : null,
        dateFilterDto?.dateFilterOption
          ? {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            }
          : null,
      )
      .addSelect('SUM(orderItem.price * orderItem.quantity)', 'totalSales')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['totalSales'] = parseFloat(raw[i]['totalSales']) || 0;
    }
    return entities;
  }

  // find with orders count.
  async findWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Product[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterDto.startDate,
        endDate: dateFilterDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterDto.dateFilterOption);
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
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('product.serviceType = :serviceType', { serviceType })
      .groupBy('product.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }
}
