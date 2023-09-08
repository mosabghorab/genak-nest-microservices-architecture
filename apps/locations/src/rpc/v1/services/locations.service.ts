import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateFilterDto, DateFilterOption, DateHelpers, FindOneByIdDto, Location, ServiceType, VendorStatus } from '@app/common';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Location>): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find governorates with vendors , customers and orders count.
  async findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType: ServiceType): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin('location.vendors', 'vendor', 'vendor.serviceType = :serviceType', { serviceType })
      .leftJoin('customer.orders', 'order', 'order.serviceType = :serviceType', { serviceType })
      .addSelect(['COUNT(DISTINCT vendor.id) AS vendorsCount', 'COUNT(DISTINCT customer.id) AS customersCount', 'COUNT(DISTINCT order.id) AS ordersCount'])
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['vendorsCount'] = parseInt(raw[i]['vendorsCount']) || 0;
      entities[i]['customersCount'] = parseInt(raw[i]['customersCount']) || 0;
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }

  // find governorates with orders count.
  async findGovernoratesWithOrdersCount(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<Location[]> {
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
      entities: Location[];
      raw: any[];
    } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin('customer.orders', 'order', `order.serviceType = :serviceType${dateFilterDto?.dateFilterOption ? ' AND order.createdAt BETWEEN :startDate AND :endDate' : ''}`, {
        serviceType,
        startDate: dateFilterDto?.dateFilterOption ? dateRange.startDate : null,
        endDate: dateFilterDto?.dateFilterOption ? dateRange.endDate : null,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }

  // find regions with orders count.
  async findRegionsWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Location[]> {
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
      entities: Location[];
      raw: any[];
    } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByRegion', 'customer')
      .leftJoin('customer.orders', 'order', 'order.serviceType = :serviceType AND order.createdAt BETWEEN :startDate AND :endDate', {
        serviceType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('location.parentId is NOT NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }

  // find governorates with vendors count.
  async findGovernoratesWithVendorsCount(serviceType: ServiceType): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.vendors', 'vendor', 'vendor.serviceType = :serviceType', { serviceType })
      .addSelect([
        'COUNT(DISTINCT CASE WHEN vendor.status = :documentsRequiredStatus THEN vendor.id ELSE NULL END) AS documentsRequiredVendorsCount',
        'COUNT(DISTINCT CASE WHEN vendor.status = :pendingStatus THEN vendor.id ELSE NULL END) AS pendingVendorsCount',
        'COUNT(DISTINCT CASE WHEN vendor.status = :activeStatus THEN vendor.id ELSE NULL END) AS activeVendorsCount',
      ])
      .setParameter('documentsRequiredStatus', VendorStatus.DOCUMENTS_REQUIRED)
      .setParameter('pendingStatus', VendorStatus.PENDING)
      .setParameter('activeStatus', VendorStatus.ACTIVE)
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['documentsRequiredVendorsCount'] = parseInt(raw[i]['documentsRequiredVendorsCount']) || 0;
      entities[i]['pendingVendorsCount'] = parseInt(raw[i]['pendingVendorsCount']) || 0;
      entities[i]['activeVendorsCount'] = parseInt(raw[i]['activeVendorsCount']) || 0;
    }
    return entities;
  }

  // find governorates with customers count.
  async findGovernoratesWithCustomersCount(): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .addSelect('COUNT(DISTINCT customer.id)', 'customersCount')
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['customersCount'] = parseInt(raw[i]['customersCount']) || 0;
    }
    return entities;
  }
}
