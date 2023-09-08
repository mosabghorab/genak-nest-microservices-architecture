import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Customer, FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto } from '@app/common';
import { AdminCustomersValidation } from '../validations/admin-customers.validation';
import { FindAllCustomersDto } from '../dtos/find-all-customers.dto';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Injectable()
export class AdminCustomersService {
  @InjectRepository(Customer) private readonly repo: Repository<Customer>;

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @Inject(forwardRef(() => AdminCustomersValidation))
    private readonly adminCustomersValidation: AdminCustomersValidation,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneById(<FindOneByIdDto<Customer>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!customer) {
      throw new BadRequestException(findOneOrFailByIdDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone: findOneByPhoneDto.phone },
      relations: findOneByPhoneDto.relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Customer>): Promise<Customer> {
    const customer: Customer = await this.findOneByPhone(<FindOneByPhoneDto<Customer>>{
      phone: findOneOrFailByPhoneDto.phone,
      relations: findOneOrFailByPhoneDto.relations,
    });
    if (!customer) {
      throw new BadRequestException(findOneOrFailByPhoneDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find all.
  async findAll(findAllCustomersDto: FindAllCustomersDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Customer[];
    currentPage: number;
  }> {
    const offset: number = (findAllCustomersDto.page - 1) * findAllCustomersDto.limit;
    const queryBuilder: SelectQueryBuilder<Customer> = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.governorate', 'governorate')
      .leftJoinAndSelect('customer.region', 'region')
      .leftJoin('customer.orders', 'order')
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .groupBy('customer.id')
      .skip(offset)
      .take(findAllCustomersDto.limit);
    const { entities, raw }: { entities: Customer[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return {
      perPage: findAllCustomersDto.limit,
      currentPage: findAllCustomersDto.page,
      lastPage: Math.ceil(count / findAllCustomersDto.limit),
      total: count,
      data: entities,
    };
  }

  // create.
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    await this.adminCustomersValidation.validateCreation(createCustomerDto);
    return await this.customerRepository.save(await this.customerRepository.create(createCustomerDto));
  }

  // update.
  async update(customerId: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer: Customer = await this.adminCustomersValidation.validateUpdate(customerId, updateCustomerDto);
    Object.assign(customer, updateCustomerDto);
    return this.customerRepository.save(customer);
  }

  // remove.
  async remove(id: number): Promise<Customer> {
    const customer: Customer = await this.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id,
    });
    return this.customerRepository.remove(customer);
  }
}
