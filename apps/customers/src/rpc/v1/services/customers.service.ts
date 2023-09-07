import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer, CustomerSignUpDto, CustomerUpdateProfileDto, FindOneByIdDto, FindOneByPhoneDto } from '@app/common';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone: findOneByPhoneDto.phone },
      relations: findOneByPhoneDto.relations,
    });
  }

  // create.
  async create(customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return this.customerRepository.save(await this.customerRepository.create(customerSignUpDto));
  }

  // update profile.
  async updateProfile(customerUpdateProfileDto: CustomerUpdateProfileDto): Promise<Customer> {
    const customer: Customer = await this.findOneById(<FindOneByIdDto<Customer>>{
      id: customerUpdateProfileDto.customerId,
    });
    Object.assign(customer, customerUpdateProfileDto);
    return this.customerRepository.save(customer);
  }

  // remove one by instance.
  removeOneByInstance(customer: Customer): Promise<Customer> {
    return this.customerRepository.remove(customer);
  }
}
