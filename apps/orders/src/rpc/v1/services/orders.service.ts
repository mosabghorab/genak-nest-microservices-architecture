import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { DateFilterDto, DateFilterOption, DateHelpers, FindOneByIdDto, FindOneOrderByIdAndServiceTypeDto, Order, SearchPayloadDto, ServiceType } from '@app/common';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // search by unique id.
  searchByUniqueId(searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      where: { uniqueId: ILike(`%${searchPayloadDto.searchQuery}%`) },
    });
  }

  // find one by id and service type.
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypeDto: FindOneOrderByIdAndServiceTypeDto): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        id: findOneOrderByIdAndServiceTypeDto.id,
        serviceType: findOneOrderByIdAndServiceTypeDto.serviceType,
      },
      relations: findOneOrderByIdAndServiceTypeDto.relations,
    });
  }

  // count.
  count(serviceType?: ServiceType, dateFilterDto?: DateFilterDto): Promise<number> {
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
    return this.orderRepository.count({
      where: {
        serviceType,
        createdAt: dateFilterDto?.dateFilterOption ? Between(dateRange.startDate, dateRange.endDate) : null,
      },
    });
  }

  // total sales.
  async totalSales(
    serviceType: ServiceType,
    dateFilterDto?: DateFilterDto,
  ): Promise<{
    totalSales: string;
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
    const queryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'totalSales')
      .where('order.serviceType = :serviceType', { serviceType });
    if (dateFilterDto?.dateFilterOption) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    return queryBuilder.getRawOne();
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      where: { serviceType },
      relations,
      take: count,
    });
  }
}
