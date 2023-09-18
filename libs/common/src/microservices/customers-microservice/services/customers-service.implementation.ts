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
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomersServiceImpl implements ICustomersService {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<
        Customer,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(
      rpcAuthenticationPayloadDto,
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
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]> {
    return firstValueFrom<Customer[]>(
      this.customersMicroservice.send<
        Customer[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          searchPayloadDto: SearchPayloadDto<Customer>;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          searchPayloadDto,
        },
      ),
    );
  }

  // create.
  create(customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<
        Customer,
        {
          customerSignUpPayloadDto: CustomerSignUpPayloadDto;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { customerSignUpPayloadDto },
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, customer: Customer): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<
        Customer,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          customer: Customer;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, customer },
      ),
    );
  }

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send<
        Customer,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, customerUpdateProfilePayloadDto },
      ),
    );
  }

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto): Promise<number> {
    return firstValueFrom<number>(
      this.customersMicroservice.send<number, { rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto }>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto },
      ),
    );
  }

  // find best buyers with orders count.
  findBestBuyersWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]> {
    return firstValueFrom<Customer[]>(
      this.customersMicroservice.send<
        Customer[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_BEST_BUYERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
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
