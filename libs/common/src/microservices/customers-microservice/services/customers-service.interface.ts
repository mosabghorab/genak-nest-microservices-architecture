import { Customer, CustomerSignUpDto, CustomerUpdateProfileDto, DateFilterDto, FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto, ServiceType } from '@app/common';

export interface ICustomersService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Customer>): Promise<Customer>;

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Customer>): Promise<Customer>;

  // create.
  create(customerSignUpDto: CustomerSignUpDto): Promise<Customer>;

  // remove on by instance.
  removeOneByInstance(customer: Customer): Promise<Customer>;

  // update profile.
  updateProfile(customerUpdateProfileDto: CustomerUpdateProfileDto): Promise<Customer>;

  // count.
  count(): Promise<number>;

  // find best buyers with orders count.
  findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Customer[]>;
}
