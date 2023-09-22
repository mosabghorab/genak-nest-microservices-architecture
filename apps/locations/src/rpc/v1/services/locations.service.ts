import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateFilterOption, DateFilterPayloadDto, DateHelpers, FindOneByIdPayloadDto, Location, ServiceType, VendorStatus } from '@app/common';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find governorates with vendors , customers and orders count.
  async findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType: ServiceType): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin('location.vendors', 'vendor', 'vendor.serviceType = :serviceType', { serviceType })
      .leftJoin('customer.orders', 'order', 'order.serviceType = :serviceType', { serviceType })
      .addSelect(['COUNT(DISTINCT vendor.id) AS vendors_count', 'COUNT(DISTINCT customer.id) AS customers_count', 'COUNT(DISTINCT order.id) AS orders_count'])
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['vendorsCount'] = parseInt(raw[i]['vendors_count']) || 0;
      entities[i]['customersCount'] = parseInt(raw[i]['customers_count']) || 0;
      entities[i]['ordersCount'] = parseInt(raw[i]['orders_count']) || 0;
    }
    return entities;
  }

  // find governorates with orders count.
  async findGovernoratesWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Location[]> {
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
      entities: Location[];
      raw: any[];
    } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .leftJoin('customer.orders', 'order', `order.serviceType = :serviceType${dateFilterPayloadDto?.dateFilterOption ? ' AND order.createdAt BETWEEN :startDate AND :endDate' : ''}`, {
        serviceType,
        startDate: dateFilterPayloadDto?.dateFilterOption ? dateRange.startDate : null,
        endDate: dateFilterPayloadDto?.dateFilterOption ? dateRange.endDate : null,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'orders_count')
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['orders_count']) || 0;
    }
    return entities;
  }

  // find regions with orders count.
  async findRegionsWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Location[]> {
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
      .addSelect('COUNT(DISTINCT order.id)', 'orders_count')
      .where('location.parentId is NOT NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['orders_count']) || 0;
    }
    return entities;
  }

  // find governorates with vendors count.
  async findGovernoratesWithVendorsCount(serviceType: ServiceType): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.vendors', 'vendor', 'vendor.serviceType = :serviceType', { serviceType })
      .addSelect([
        'COUNT(DISTINCT CASE WHEN vendor.status = :documentsRequiredStatus THEN vendor.id ELSE NULL END) AS documents_required_vendors_count',
        'COUNT(DISTINCT CASE WHEN vendor.status = :pendingStatus THEN vendor.id ELSE NULL END) AS pending_vendors_count',
        'COUNT(DISTINCT CASE WHEN vendor.status = :activeStatus THEN vendor.id ELSE NULL END) AS active_vendors_count',
      ])
      .setParameter('documentsRequiredStatus', VendorStatus.DOCUMENTS_REQUIRED)
      .setParameter('pendingStatus', VendorStatus.PENDING)
      .setParameter('activeStatus', VendorStatus.ACTIVE)
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['documentsRequiredVendorsCount'] = parseInt(raw[i]['documents_required_vendors_count']) || 0;
      entities[i]['pendingVendorsCount'] = parseInt(raw[i]['pending_vendors_count']) || 0;
      entities[i]['activeVendorsCount'] = parseInt(raw[i]['active_vendors_count']) || 0;
    }
    return entities;
  }

  // find governorates with customers count.
  async findGovernoratesWithCustomersCount(): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.customersByGovernorate', 'customer')
      .addSelect('COUNT(DISTINCT customer.id)', 'customers_count')
      .where('location.parentId is NULL')
      .groupBy('location.id')
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['customersCount'] = parseInt(raw[i]['customers_count']) || 0;
    }
    return entities;
  }
}
