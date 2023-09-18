import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  ILocationsService,
  Location,
  LocationsMicroserviceConstants,
  RpcAuthenticationPayloadDto,
  ServiceType,
} from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';

export class LocationsServiceImpl implements ILocationsService {
  constructor(private readonly locationsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null> {
    return firstValueFrom<Location>(
      this.locationsMicroservice.send<Location, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Location> }>(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Location>): Promise<Location> {
    const location: Location = await this.findOneById(
      new FindOneByIdPayloadDto<Location>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!location) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Location not found.');
    }
    return location;
  }

  // find governorates with customers count.
  findGovernoratesWithCustomersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto): Promise<Location[]> {
    return firstValueFrom<Location[]>(
      this.locationsMicroservice.send<Location[], { rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto }>(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_CUSTOMERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto },
      ),
    );
  }

  // find governorates with orders count.
  findGovernoratesWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Location[]> {
    return firstValueFrom<Location[]>(
      this.locationsMicroservice.send<
        Location[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }

  // find governorates with vendors , customers and orders count.
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType): Promise<Location[]> {
    return firstValueFrom<Location[]>(
      this.locationsMicroservice.send<
        Location[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
        }
      >(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_AND_CUSTOMERS_AND_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, serviceType },
      ),
    );
  }

  // find governorates with vendors count.
  findGovernoratesWithVendorsCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType): Promise<Location[]> {
    return firstValueFrom<Location[]>(
      this.locationsMicroservice.send<
        Location[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
        }
      >(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, serviceType },
      ),
    );
  }

  // find regions with orders count.
  findRegionsWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Location[]> {
    return firstValueFrom<Location[]>(
      this.locationsMicroservice.send<
        Location[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_REGIONS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }
}
