import { Controller, UseGuards } from '@nestjs/common';
import {
  AllowFor,
  AuthGuard,
  Customer,
  CustomerSignUpPayloadDto,
  CustomersMicroserviceConstants,
  CustomerUpdateProfilePayloadDto,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  Public,
  SearchPayloadDto,
  ServiceType,
  SkipAdminRoles,
  UserType,
} from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from '../services/customers.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneById(findOneByIdPayloadDto);
  }

  @Public()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByPhone(@Payload('findOneByPhonePayloadDto') findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneByPhone(findOneByPhonePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${VERSION}`,
  })
  searchByName(@Payload('searchPayloadDto') searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]> {
    return this.customersService.searchByName(searchPayloadDto);
  }

  @Public()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  create(@Payload('customerSignUpPayloadDto') customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer> {
    return this.customersService.create(customerSignUpPayloadDto);
  }

  @AllowFor(UserType.CUSTOMER)
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneByInstance(@Payload() customer: Customer): Promise<Customer> {
    return this.customersService.removeOneByInstance(customer);
  }

  @AllowFor(UserType.CUSTOMER)
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@Payload('customerUpdateProfilePayloadDto') customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer> {
    return this.customersService.updateProfile(customerUpdateProfilePayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  count(): Promise<number> {
    return this.customersService.count();
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_BEST_BUYERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findBestBuyersWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]> {
    return this.customersService.findBestBuyersWithOrdersCount(serviceType, dateFilterPayloadDto);
  }
}
