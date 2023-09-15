import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  Customer,
  CustomerSignUpPayloadDto,
  CustomerUpdateProfilePayloadDto,
  DateFilterOption,
  DateFilterPayloadDto,
  DateHelpers,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone: findOneByPhonePayloadDto.phone },
      relations: findOneByPhonePayloadDto.relations,
    });
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Customer>): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { name: ILike(`%${searchPayloadDto.searchQuery}%`) },
    });
  }

  // create.
  async create(customerSignUpPayloadDto: CustomerSignUpPayloadDto): Promise<Customer> {
    return this.customerRepository.save(await this.customerRepository.create(customerSignUpPayloadDto));
  }

  // update profile.
  async updateProfile(customerUpdateProfilePayloadDto: CustomerUpdateProfilePayloadDto): Promise<Customer> {
    const customer: Customer = await this.findOneById(
      new FindOneByIdPayloadDto<Customer>({
        id: customerUpdateProfilePayloadDto.customerId,
      }),
    );
    Object.assign(customer, customerUpdateProfilePayloadDto);
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
  async findBestBuyersWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Customer[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterPayloadDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterPayloadDto.startDate,
        endDate: dateFilterPayloadDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterPayloadDto.dateFilterOption);
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
