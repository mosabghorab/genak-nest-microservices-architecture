import {
  Customer,
  CustomerSignUpPayloadDto,
  CustomerUpdateProfilePayloadDto,
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';

export interface ICustomersService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Customer>): Promise<Customer>;

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Customer>): Promise<Customer>;

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]>;

  // create.
  create(customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer>;

  // remove on by instance.
  removeOneByInstance(customer: Customer): Promise<Customer>;

  // update profile.
  updateProfile(customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer>;

  // count.
  count(): Promise<number>;

  // find best buyers with orders count.
  findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]>;
}
