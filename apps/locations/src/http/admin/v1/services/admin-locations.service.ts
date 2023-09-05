import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  DateFilterOption,
  DateHelpers,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
  Location,
  ServiceType,
  VendorStatus,
} from '@app/common';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';

@Injectable()
export class AdminLocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  // find one by id.
  findOneById(
    findOneByIdDto: FindOneByIdDto<Location>,
  ): Promise<Location | null> {
    return this.locationRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(
    findOneOrFailByIdDto: FindOneOrFailByIdDto<Location>,
  ): Promise<Location> {
    const location: Location = await this.findOneById(<
      FindOneByIdDto<Location>
    >{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!location) {
      throw new BadRequestException(
        findOneOrFailByIdDto.failureMessage || 'Location not found.',
      );
    }
    return location;
  }

  // find all.
  async findAll(findAllLocationsDto: FindAllLocationsDto): Promise<Location[]> {
    if (findAllLocationsDto.parentId) {
      await this.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: findAllLocationsDto.parentId,
        failureMessage: 'Parent not found.',
      });
    }
    return this.locationRepository.find({
      where: {
        parentId: findAllLocationsDto.parentId
          ? findAllLocationsDto.parentId
          : IsNull(),
      },
    });
  }

  // create.
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationRepository.save(
      await this.locationRepository.create(createLocationDto),
    );
  }

  // update.
  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location: Location = await this.findOneOrFailById(<
      FindOneOrFailByIdDto<Location>
    >{
      id,
    });
    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  // remove.
  async remove(id: number): Promise<Location> {
    const location: Location = await this.findOneOrFailById(<
      FindOneOrFailByIdDto<Location>
    >{
      id,
    });
    return this.locationRepository.remove(location);
  }

  // find governorates with vendors , customers and orders count.
  async findGovernoratesWithVendorsAndCustomersAndOrdersCount(
    serviceType: ServiceType,
  ): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } =
      await this.locationRepository
        .createQueryBuilder('location')
        .leftJoin('location.customersByGovernorate', 'customer')
        .leftJoin(
          'location.vendors',
          'vendor',
          'vendor.serviceType = :serviceType',
          { serviceType },
        )
        .leftJoin(
          'customer.orders',
          'order',
          'order.serviceType = :serviceType',
          { serviceType },
        )
        .addSelect([
          'COUNT(DISTINCT vendor.id) AS vendorsCount',
          'COUNT(DISTINCT customer.id) AS customersCount',
          'COUNT(DISTINCT order.id) AS ordersCount',
        ])
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
  async findGovernoratesWithOrdersCount(
    serviceType: ServiceType,
    dateFilterOption?: DateFilterOption,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Location[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption) {
      if (dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: startDate,
          endDate: endDate,
        };
      } else {
        dateRange =
          DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
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
      .leftJoin(
        'customer.orders',
        'order',
        `order.serviceType = :serviceType${
          dateFilterOption
            ? ' AND order.createdAt BETWEEN :startDate AND :endDate'
            : ''
        }`,
        {
          serviceType,
          startDate: dateFilterOption ? dateRange.startDate : null,
          endDate: dateFilterOption ? dateRange.endDate : null,
        },
      )
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
  async findRegionsWithOrdersCount(
    serviceType: ServiceType,
    dateFilterOption: DateFilterOption,
    startDate: Date,
    endDate: Date,
  ): Promise<Location[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
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
      .leftJoin(
        'customer.orders',
        'order',
        'order.serviceType = :serviceType AND order.createdAt BETWEEN :startDate AND :endDate',
        {
          serviceType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      )
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
  async findGovernoratesWithVendorsCount(
    serviceType: ServiceType,
  ): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } =
      await this.locationRepository
        .createQueryBuilder('location')
        .leftJoin(
          'location.vendors',
          'vendor',
          'vendor.serviceType = :serviceType',
          { serviceType },
        )
        .addSelect([
          'COUNT(DISTINCT CASE WHEN vendor.status = :documentsRequiredStatus THEN vendor.id ELSE NULL END) AS documentsRequiredVendorsCount',
          'COUNT(DISTINCT CASE WHEN vendor.status = :pendingStatus THEN vendor.id ELSE NULL END) AS pendingVendorsCount',
          'COUNT(DISTINCT CASE WHEN vendor.status = :activeStatus THEN vendor.id ELSE NULL END) AS activeVendorsCount',
        ])
        .setParameter(
          'documentsRequiredStatus',
          VendorStatus.DOCUMENTS_REQUIRED,
        )
        .setParameter('pendingStatus', VendorStatus.PENDING)
        .setParameter('activeStatus', VendorStatus.ACTIVE)
        .where('location.parentId is NULL')
        .groupBy('location.id')
        .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['documentsRequiredVendorsCount'] =
        parseInt(raw[i]['documentsRequiredVendorsCount']) || 0;
      entities[i]['pendingVendorsCount'] =
        parseInt(raw[i]['pendingVendorsCount']) || 0;
      entities[i]['activeVendorsCount'] =
        parseInt(raw[i]['activeVendorsCount']) || 0;
    }
    return entities;
  }

  // find governorates with customers count.
  async findGovernoratesWithCustomersCount(): Promise<Location[]> {
    const { entities, raw }: { entities: Location[]; raw: any[] } =
      await this.locationRepository
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
