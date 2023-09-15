import { DateFilterPayloadDto, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Location, ServiceType } from '@app/common';

export interface ILocationsService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Location>): Promise<Location>;

  // find governorates with vendors , customers and orders count.
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType: ServiceType): Promise<Location[]>;

  // find governorates with orders count.
  findGovernoratesWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Location[]>;

  // find regions with orders count.
  findRegionsWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Location[]>;

  // find governorates with vendors count.
  findGovernoratesWithVendorsCount(serviceType: ServiceType): Promise<Location[]>;

  // find governorates with customers count.
  findGovernoratesWithCustomersCount(): Promise<Location[]>;
}
