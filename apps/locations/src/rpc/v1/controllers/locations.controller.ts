import { Controller } from '@nestjs/common';
import { DateFilterPayloadDto, FindOneByIdPayloadDto, Location, LocationsMicroserviceConstants, ServiceType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocationsService } from '../services/locations.service';

const VERSION = '1';

@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null> {
    return this.locationsService.findOneById(findOneByIdPayloadDto);
  }

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_REGIONS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findRegionsWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Location[]> {
    return this.locationsService.findRegionsWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithVendorsCount(@Payload() serviceType: ServiceType): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithVendorsCount(serviceType);
  }

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_CUSTOMERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithCustomersCount(): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithCustomersCount();
  }

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_AND_CUSTOMERS_AND_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(@Payload() serviceType: ServiceType): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType);
  }
}
