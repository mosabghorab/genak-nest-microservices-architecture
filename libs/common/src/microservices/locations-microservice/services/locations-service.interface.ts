import { DateFilterDto, FindOneByIdDto, FindOneOrFailByIdDto, Location, ServiceType } from '@app/common';

export interface ILocationsService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Location>): Promise<Location | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Location>): Promise<Location>;

  // find governorates with vendors , customers and orders count.
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType: ServiceType): Promise<Location[]>;

  // find governorates with orders count.
  findGovernoratesWithOrdersCount(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<Location[]>;

  // find regions with orders count.
  findRegionsWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Location[]>;

  // find governorates with vendors count.
  findGovernoratesWithVendorsCount(serviceType: ServiceType): Promise<Location[]>;

  // find governorates with customers count.
  findGovernoratesWithCustomersCount(): Promise<Location[]>;
}
