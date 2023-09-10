import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, SelectQueryBuilder } from 'typeorm';
import {
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateFilterOption,
  DateHelpers,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
  Order,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { FindVendorOrdersDto } from '../dtos/find-vendor-orders.dto';
import { FindCustomerOrdersDto } from '../dtos/find-customer-orders.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { Workbook, Worksheet } from 'exceljs';
import { createReadStream } from 'fs';
import * as fsExtra from 'fs-extra';

@Injectable()
export class AdminOrdersService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id: findOneByIdDto.id }, relations: findOneByIdDto.relations });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(<FindOneByIdDto<Order>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!order) {
      throw new BadRequestException(findOneOrFailByIdDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(findAllOrdersDto: FindAllOrdersDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        currentPage: number;
      }
    | { total: number; data: Order[] }
  > {
    const offset: number = (findAllOrdersDto.page - 1) * findAllOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllOrdersDto.startDate,
        endDate: findAllOrdersDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllOrdersDto.dateFilterOption);
    }
    const [orders, count]: [Order[], number] = await this.orderRepository.findAndCount({
      where: {
        serviceType: findAllOrdersDto.serviceType,
        status: findAllOrdersDto.status,
        createdAt: Between(dateRange.startDate, dateRange.endDate),
      },
      relations: {
        customer: true,
        vendor: true,
      },
      skip: findAllOrdersDto.paginationEnable ? offset : null,
      take: findAllOrdersDto.paginationEnable ? findAllOrdersDto.limit : null,
    });
    return findAllOrdersDto.paginationEnable
      ? {
          perPage: findAllOrdersDto.limit,
          currentPage: findAllOrdersDto.page,
          lastPage: Math.ceil(count / findAllOrdersDto.limit),
          total: count,
          data: orders,
        }
      : {
          total: count,
          data: orders,
        };
  }

  // find all by customer id.
  async findAllByCustomerId(
    customerId: number,
    findCustomerOrdersDto: FindCustomerOrdersDto,
  ): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        ordersTotalPrice: any;
        currentPage: number;
      }
    | { total: number; data: Order[]; ordersTotalPrice: any }
  > {
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
    const offset: number = (findCustomerOrdersDto.page - 1) * findCustomerOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findCustomerOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findCustomerOrdersDto.startDate,
        endDate: findCustomerOrdersDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findCustomerOrdersDto.dateFilterOption);
    }
    const mainQueryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .where('order.customerId = :customerId', {
        customerId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findCustomerOrdersDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findCustomerOrdersDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findCustomerOrdersDto.status,
      });
    }
    const ordersQueryBuilder: SelectQueryBuilder<Order> = mainQueryBuilder.clone().leftJoinAndSelect('order.vendor', 'vendor');
    if (findCustomerOrdersDto.paginationEnable) ordersQueryBuilder.skip(offset).take(findCustomerOrdersDto.limit);
    const [orders, count]: [Order[], number] = await ordersQueryBuilder.getManyAndCount();
    const { ordersTotalPrice } = await mainQueryBuilder.clone().select('SUM(order.total)', 'ordersTotalPrice').getRawOne();
    return findCustomerOrdersDto.paginationEnable
      ? {
          perPage: findCustomerOrdersDto.limit,
          currentPage: findCustomerOrdersDto.page,
          lastPage: Math.ceil(count / findCustomerOrdersDto.limit),
          total: count,
          ordersTotalPrice: ordersTotalPrice || 0,
          data: orders,
        }
      : {
          total: count,
          ordersTotalPrice: ordersTotalPrice || 0,
          data: orders,
        };
  }

  // find all by vendor id.
  async findAllByVendorId(
    vendorId: number,
    findVendorOrdersDto: FindVendorOrdersDto,
  ): Promise<
    | {
        total: number;
        perPage: number;
        ordersAverageTimeMinutes: number;
        lastPage: number;
        data: Order[];
        ordersTotalPrice: any;
        currentPage: number;
      }
    | { total: number; ordersAverageTimeMinutes: number; data: Order[]; ordersTotalPrice: any }
  > {
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    const { ordersAverageTimeMinutes } = await this.orderRepository
      .createQueryBuilder('order')
      .select('AVG(order.averageTimeMinutes)', 'ordersAverageTimeMinutes')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersDto.serviceType,
      })
      .getRawOne();
    const offset: number = (findVendorOrdersDto.page - 1) * findVendorOrdersDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findVendorOrdersDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findVendorOrdersDto.startDate,
        endDate: findVendorOrdersDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findVendorOrdersDto.dateFilterOption);
    }
    const mainQueryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findVendorOrdersDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findVendorOrdersDto.status,
      });
    }

    const ordersQueryBuilder: SelectQueryBuilder<Order> = mainQueryBuilder.clone().leftJoinAndSelect('order.customer', 'customer');
    if (findVendorOrdersDto.paginationEnable) ordersQueryBuilder.skip(offset).take(findVendorOrdersDto.limit);
    const [orders, count]: [Order[], number] = await ordersQueryBuilder.getManyAndCount();
    const { ordersTotalPrice } = await mainQueryBuilder.clone().select('SUM(order.total)', 'ordersTotalPrice').getRawOne();
    return findVendorOrdersDto.paginationEnable
      ? {
          perPage: findVendorOrdersDto.limit,
          currentPage: findVendorOrdersDto.page,
          lastPage: Math.ceil(count / findVendorOrdersDto.limit),
          total: count,
          ordersTotalPrice: ordersTotalPrice || 0,
          ordersAverageTimeMinutes: Math.floor(ordersAverageTimeMinutes) || 0,
          data: orders,
        }
      : {
          total: count,
          ordersTotalPrice: ordersTotalPrice || 0,
          ordersAverageTimeMinutes: Math.floor(ordersAverageTimeMinutes) || 0,
          data: orders,
        };
  }

  // remove.
  async remove(id: number): Promise<Order> {
    const order: Order = await this.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id,
    });
    return this.orderRepository.remove(order);
  }

  // export all.
  async exportAll(findAllOrdersDto: FindAllOrdersDto): Promise<StreamableFile> {
    const { data }: { data: Order[] } = await this.findAll(findAllOrdersDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('الطلبات');
    // add headers.
    worksheet.addRow(['رقم الطلب', 'الزبون', 'الموزع', 'حالة الطلب', 'تاريخ الطلب', 'وقت الطلب']);
    // add data rows.
    data.forEach((order: Order): void => {
      const hours: number = order.createdAt.getHours();
      const minutes: number = order.createdAt.getMinutes();
      const seconds: number = order.createdAt.getSeconds();
      const orderTime: string = hours + ':' + minutes + ':' + seconds;
      worksheet.addRow([order.uniqueId, order.customer.name, order.vendor.commercialName, order.status, order.createdAt.toDateString(), orderTime]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }

  // export all by customer id.
  async exportAllByCustomerId(customerId: number, findCustomerOrdersDto: FindCustomerOrdersDto): Promise<StreamableFile> {
    const { data }: { data: Order[] } = await this.findAllByCustomerId(customerId, findCustomerOrdersDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('الطلبات');
    // add headers.
    worksheet.addRow(['رقم الطلب', 'الموزع', 'حالة الطلب', 'تاريخ الطلب', 'وقت الطلب']);
    // add data rows.
    data.forEach((order: Order): void => {
      const hours: number = order.createdAt.getHours();
      const minutes: number = order.createdAt.getMinutes();
      const seconds: number = order.createdAt.getSeconds();
      const orderTime: string = hours + ':' + minutes + ':' + seconds;
      worksheet.addRow([order.uniqueId, order.vendor.commercialName, order.status, order.createdAt.toDateString(), orderTime]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }

  // export all by vendor id.
  async exportAllByVendorId(vendorId: number, findVendorOrdersDto: FindVendorOrdersDto): Promise<StreamableFile> {
    const { data }: { data: Order[] } = await this.findAllByVendorId(vendorId, findVendorOrdersDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('الطلبات');
    // add headers.
    worksheet.addRow(['رقم الطلب', 'الزبون', 'حالة الطلب', 'تاريخ الطلب', 'وقت الطلب']);
    // add data rows.
    data.forEach((order: Order): void => {
      const hours: number = order.createdAt.getHours();
      const minutes: number = order.createdAt.getMinutes();
      const seconds: number = order.createdAt.getSeconds();
      const orderTime: string = hours + ':' + minutes + ':' + seconds;
      worksheet.addRow([order.uniqueId, order.customer.name, order.status, order.createdAt.toDateString(), orderTime]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }
}
