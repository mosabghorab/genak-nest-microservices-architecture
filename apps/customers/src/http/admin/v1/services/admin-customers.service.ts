import { BadRequestException, forwardRef, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Customer, FindOneByIdPayloadDto, FindOneByPhonePayloadDto, FindOneOrFailByIdPayloadDto, FindOneOrFailByPhonePayloadDto } from '@app/common';
import { AdminCustomersValidation } from '../validations/admin-customers.validation';
import { FindAllCustomersRequestDto } from '../dtos/find-all-customers-request.dto';
import { CreateCustomerRequestDto } from '../dtos/create-customer-request.dto';
import { UpdateCustomerRequestDto } from '../dtos/update-customer-request.dto';
import { Workbook, Worksheet } from 'exceljs';
import * as fsExtra from 'fs-extra';
import { createReadStream } from 'fs';

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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
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
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Customer>): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { phone: findOneByPhonePayloadDto.phone },
      relations: findOneByPhonePayloadDto.relations,
    });
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
      throw new BadRequestException(findOneOrFailByPhonePayloadDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find all.
  async findAll(findAllCustomersRequestDto: FindAllCustomersRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Customer[];
        currentPage: number;
      }
    | { total: number; data: Customer[] }
  > {
    const offset: number = (findAllCustomersRequestDto.page - 1) * findAllCustomersRequestDto.limit;
    const queryBuilder: SelectQueryBuilder<Customer> = this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.governorate', 'governorate')
      .leftJoinAndSelect('customer.region', 'region')
      .leftJoin('customer.orders', 'order')
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .groupBy('customer.id');
    if (findAllCustomersRequestDto.paginationEnable) queryBuilder.skip(offset).take(findAllCustomersRequestDto.limit);
    const { entities, raw }: { entities: Customer[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return findAllCustomersRequestDto.paginationEnable
      ? {
          perPage: findAllCustomersRequestDto.limit,
          currentPage: findAllCustomersRequestDto.page,
          lastPage: Math.ceil(count / findAllCustomersRequestDto.limit),
          total: count,
          data: entities,
        }
      : { total: count, data: entities };
  }

  // create.
  async create(createCustomerRequestDto: CreateCustomerRequestDto): Promise<Customer> {
    await this.adminCustomersValidation.validateCreation(createCustomerRequestDto);
    return await this.customerRepository.save(await this.customerRepository.create(createCustomerRequestDto));
  }

  // update.
  async update(customerId: number, updateCustomerRequestDto: UpdateCustomerRequestDto): Promise<Customer> {
    const customer: Customer = await this.adminCustomersValidation.validateUpdate(customerId, updateCustomerRequestDto);
    Object.assign(customer, updateCustomerRequestDto);
    return this.customerRepository.save(customer);
  }

  // remove.
  async remove(id: number): Promise<Customer> {
    const customer: Customer = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id,
      }),
    );
    return this.customerRepository.remove(customer);
  }

  // export all.
  async exportAll(findAllCustomersRequestDto: FindAllCustomersRequestDto): Promise<StreamableFile> {
    const { data }: { data: Customer[] } = await this.findAll(findAllCustomersRequestDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('الزبائن');
    // add headers.
    worksheet.addRow(['اسم الزبون', 'رقم الجوال', 'عدد الطلبات', 'المدينة', 'الحي']);
    // add data rows.
    data.forEach((customer: Customer): void => {
      worksheet.addRow([customer.name, customer.phone, customer['ordersCount'], customer.governorate.name, customer.region.name]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }
}
