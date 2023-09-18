import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, DateFilterPayloadDto, FindOneByIdPayloadDto, Location, LocationsMicroserviceConstants, Public, ServiceType, SkipAdminRoles, UserType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocationsService } from '../services/locations.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Public()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Location>): Promise<Location | null> {
    return this.locationsService.findOneById(findOneByIdPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_REGIONS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findRegionsWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Location[]> {
    return this.locationsService.findRegionsWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithVendorsCount(@Payload('serviceType') serviceType: ServiceType): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithVendorsCount(serviceType);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_CUSTOMERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithCustomersCount(): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithCustomersCount();
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_AND_CUSTOMERS_AND_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findGovernoratesWithVendorsAndCustomersAndOrdersCount(@Payload('serviceType') serviceType: ServiceType): Promise<Location[]> {
    return this.locationsService.findGovernoratesWithVendorsAndCustomersAndOrdersCount(serviceType);
  }
}
