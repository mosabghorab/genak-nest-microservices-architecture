import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  Customer,
  CustomerSignUpDto,
  CustomerUpdateProfileDto,
  DateFilterDto,
  DateFilterOption,
  DateHelpers,
  FindOneByIdDto,
  FindOneByPhoneDto,
  OrderByType,
  SearchPayloadDto,
  ServiceType,
} from '@app/common';

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

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { name: ILike(`%${searchPayloadDto.searchQuery}%`) },
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

  // count.
  count(): Promise<number> {
    return this.customerRepository.count();
  }

  // find best buyers with orders count.
  async findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Customer[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterDto.startDate,
        endDate: dateFilterDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterDto.dateFilterOption);
    }
    const { entities, raw }: { entities: Customer[]; raw: any[] } = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoin('customer.orders', 'order', 'order.serviceType = :serviceType AND order.createdAt BETWEEN :startDate AND :endDate', {
        serviceType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .groupBy('customer.id')
      .having('ordersCount > 0')
      .orderBy('ordersCount', OrderByType.DESC)
      .limit(5)
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }
}
