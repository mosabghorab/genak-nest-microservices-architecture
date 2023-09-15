import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, ILike, Repository, SelectQueryBuilder } from 'typeorm';
import { DateFilterOption, DateFilterPayloadDto, DateHelpers, FindOneByIdPayloadDto, FindOneOrderByIdAndServiceTypePayloadDto, Order, SearchPayloadDto, ServiceType } from '@app/common';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // search by unique id.
  searchByUniqueId(searchPayloadDto: SearchPayloadDto<Order>): Promise<Order[]> {
    return this.orderRepository.find({
      where: { uniqueId: ILike(`%${searchPayloadDto.searchQuery}%`) },
      relations: searchPayloadDto.relations,
    });
  }

  // find one by id and service type.
  findOneByIdAndServiceType(findOneOrderByIdAndServiceTypePayloadDto: FindOneOrderByIdAndServiceTypePayloadDto): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: {
        id: findOneOrderByIdAndServiceTypePayloadDto.id,
        serviceType: findOneOrderByIdAndServiceTypePayloadDto.serviceType,
      },
      relations: findOneOrderByIdAndServiceTypePayloadDto.relations,
    });
  }

  // count.
  count(serviceType?: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<number> {
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
    return this.orderRepository.count({
      where: {
        serviceType,
        createdAt: dateFilterPayloadDto?.dateFilterOption ? Between(dateRange.startDate, dateRange.endDate) : null,
      },
    });
  }

  // total sales.
  async totalSales(
    serviceType: ServiceType,
    dateFilterPayloadDto?: DateFilterPayloadDto,
  ): Promise<{
    totalSales: string;
  }> {
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
    const queryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'totalSales')
      .where('order.serviceType = :serviceType', { serviceType });
    if (dateFilterPayloadDto?.dateFilterOption) {
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
