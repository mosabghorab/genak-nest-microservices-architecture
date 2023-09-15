import {
  Customer,
  CustomerSignUpPayloadDto,
  CustomersMicroserviceConstants,
  CustomerUpdateProfilePayloadDto,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer> }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(
      new FindOneByIdPayloadDto<Customer>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!customer) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, { findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer> }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByPhonePayloadDto },
      ),
    );
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneByPhone(
      new FindOneByPhonePayloadDto<Customer>({
        phone: findOneOrFailByPhonePayloadDto.phone,
        relations: findOneOrFailByPhonePayloadDto.relations,
      }),
    );
    if (!customer) {
      throw new NotFoundException(findOneOrFailByPhonePayloadDto.failureMessage || 'Customer not found.');
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
  create(customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, { customerSignUpPayloadDto: CustomerSignUpPayloadDto }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { customerSignUpPayloadDto },
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
  updateProfile(customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<Customer, { customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { customerUpdateProfilePayloadDto },
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
  findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]> {
    return firstValueFrom<Customer[]>(
      this.customersMicroservice.send<
        Customer[],
        {
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_BEST_BUYERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }
}
