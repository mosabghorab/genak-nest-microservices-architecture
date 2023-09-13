import {
  Customer,
  CustomerSignUpDto,
  CustomersMicroserviceConstants,
  CustomerUpdateProfileDto,
  DateFilterDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  FindOneOrFailByPhoneDto,
  ICustomersService,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomersServiceImpl implements ICustomersService {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, FindOneByIdDto<Customer>>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(<FindOneByIdDto<Customer>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!customer) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, FindOneByPhoneDto<Customer>>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByPhoneDto,
      ),
    );
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneByPhone(<FindOneByPhoneDto<Customer>>{
      phone: findOneOrFailByPhoneDto.phone,
      relations: findOneOrFailByPhoneDto.relations,
    });
    if (!customer) {
      throw new NotFoundException(findOneOrFailByPhoneDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]> {
    return firstValueFrom<Customer[]>(
      this.customersMicroservice.send<Customer[], { searchPayloadDto: SearchPayloadDto<Customer> }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          searchPayloadDto,
        },
      ),
    );
  }

  // create.
  create(customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, CustomerSignUpDto>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN}/v${this.version}`,
        },
        customerSignUpDto,
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(customer: Customer): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, Customer>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        customer,
      ),
    );
  }

  // update profile.
  updateProfile(customerUpdateProfileDto: CustomerUpdateProfileDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, CustomerUpdateProfileDto>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        customerUpdateProfileDto,
      ),
    );
  }

  // count.
  count(): Promise<number> {
    return firstValueFrom<number>(
      this.customersMicroservice.send<number, any>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {},
      ),
    );
  }

  // find best buyers with orders count.
  findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Customer[]> {
    return firstValueFrom<Customer[]>(
      this.customersMicroservice.send<Customer[], { serviceType: ServiceType; dateFilterDto: DateFilterDto }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_BEST_BUYERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
        },
      ),
    );
  }
}
