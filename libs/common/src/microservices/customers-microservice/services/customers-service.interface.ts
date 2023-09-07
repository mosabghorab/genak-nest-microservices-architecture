import { Customer, CustomerSignUpDto, CustomerUpdateProfileDto, FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto } from '@app/common';

export interface ICustomersService {
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null>;

  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Customer>): Promise<Customer>;

  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null>;

  findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Customer>): Promise<Customer>;

  create(customerSignUpDto: CustomerSignUpDto): Promise<Customer>;

  removeOneByInstance(customer: Customer): Promise<Customer>;

  updateProfile(customerUpdateProfileDto: CustomerUpdateProfileDto): Promise<Customer>;
}
