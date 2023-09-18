import {
  Customer,
  CustomerSignUpPayloadDto,
  CustomerUpdateProfilePayloadDto,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';

export interface ICustomersService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Customer>): Promise<Customer>;

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Customer>): Promise<Customer>;

  // search by name.
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]>;

  // create.
  create(customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer>;

  // remove on by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, customer: Customer): Promise<Customer>;

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer>;

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto): Promise<number>;

  // find best buyers with orders count.
  findBestBuyersWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]>;
}
