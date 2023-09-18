import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, SelectQueryBuilder } from 'typeorm';
import {
  AuthedUser,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateFilterOption,
  DateHelpers,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  RpcAuthenticationPayloadDto,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { FindVendorOrdersRequestDto } from '../dtos/find-vendor-orders-request.dto';
import { FindCustomerOrdersRequestDto } from '../dtos/find-customer-orders-request.dto';
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(
      new FindOneByIdPayloadDto<Order>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!order) {
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<
    | {
        total: number;
        perPage: number;
        lastPage: number;
        data: Order[];
        currentPage: number;
      }
    | { total: number; data: Order[] }
  > {
    const offset: number = (findAllOrdersRequestDto.page - 1) * findAllOrdersRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllOrdersRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllOrdersRequestDto.startDate,
        endDate: findAllOrdersRequestDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllOrdersRequestDto.dateFilterOption);
    }
    const [orders, count]: [Order[], number] = await this.orderRepository.findAndCount({
      where: {
        serviceType: findAllOrdersRequestDto.serviceType,
        status: findAllOrdersRequestDto.status,
        createdAt: Between(dateRange.startDate, dateRange.endDate),
      },
      relations: {
        customer: true,
        vendor: true,
      },
      skip: findAllOrdersRequestDto.paginationEnable ? offset : null,
      take: findAllOrdersRequestDto.paginationEnable ? findAllOrdersRequestDto.limit : null,
    });
    return findAllOrdersRequestDto.paginationEnable
      ? {
          perPage: findAllOrdersRequestDto.limit,
          currentPage: findAllOrdersRequestDto.page,
          lastPage: Math.ceil(count / findAllOrdersRequestDto.limit),
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
    authedUser: AuthedUser,
    customerId: number,
    findCustomerOrdersRequestDto: FindCustomerOrdersRequestDto,
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
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: customerId,
      }),
    );
    const offset: number = (findCustomerOrdersRequestDto.page - 1) * findCustomerOrdersRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findCustomerOrdersRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findCustomerOrdersRequestDto.startDate,
        endDate: findCustomerOrdersRequestDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findCustomerOrdersRequestDto.dateFilterOption);
    }
    const mainQueryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .where('order.customerId = :customerId', {
        customerId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findCustomerOrdersRequestDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findCustomerOrdersRequestDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findCustomerOrdersRequestDto.status,
      });
    }
    const ordersQueryBuilder: SelectQueryBuilder<Order> = mainQueryBuilder.clone().leftJoinAndSelect('order.vendor', 'vendor');
    if (findCustomerOrdersRequestDto.paginationEnable) ordersQueryBuilder.skip(offset).take(findCustomerOrdersRequestDto.limit);
    const [orders, count]: [Order[], number] = await ordersQueryBuilder.getManyAndCount();
    const { ordersTotalPrice } = await mainQueryBuilder.clone().select('SUM(order.total)', 'ordersTotalPrice').getRawOne();
    return findCustomerOrdersRequestDto.paginationEnable
      ? {
          perPage: findCustomerOrdersRequestDto.limit,
          currentPage: findCustomerOrdersRequestDto.page,
          lastPage: Math.ceil(count / findCustomerOrdersRequestDto.limit),
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
    authedUser: AuthedUser,
    vendorId: number,
    findVendorOrdersRequestDto: FindVendorOrdersRequestDto,
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
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
      }),
    );
    const { ordersAverageTimeMinutes } = await this.orderRepository
      .createQueryBuilder('order')
      .select('AVG(order.averageTimeMinutes)', 'ordersAverageTimeMinutes')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersRequestDto.serviceType,
      })
      .getRawOne();
    const offset: number = (findVendorOrdersRequestDto.page - 1) * findVendorOrdersRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findVendorOrdersRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findVendorOrdersRequestDto.startDate,
        endDate: findVendorOrdersRequestDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findVendorOrdersRequestDto.dateFilterOption);
    }
    const mainQueryBuilder: SelectQueryBuilder<Order> = this.orderRepository
      .createQueryBuilder('order')
      .where('order.vendorId = :vendorId', {
        vendorId,
      })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: findVendorOrdersRequestDto.serviceType,
      })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    if (findVendorOrdersRequestDto.status) {
      mainQueryBuilder.andWhere('order.status = :status', {
        status: findVendorOrdersRequestDto.status,
      });
    }
    const ordersQueryBuilder: SelectQueryBuilder<Order> = mainQueryBuilder.clone().leftJoinAndSelect('order.customer', 'customer');
    if (findVendorOrdersRequestDto.paginationEnable) ordersQueryBuilder.skip(offset).take(findVendorOrdersRequestDto.limit);
    const [orders, count]: [Order[], number] = await ordersQueryBuilder.getManyAndCount();
    const { ordersTotalPrice } = await mainQueryBuilder.clone().select('SUM(order.total)', 'ordersTotalPrice').getRawOne();
    return findVendorOrdersRequestDto.paginationEnable
      ? {
          perPage: findVendorOrdersRequestDto.limit,
          currentPage: findVendorOrdersRequestDto.page,
          lastPage: Math.ceil(count / findVendorOrdersRequestDto.limit),
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
    const order: Order = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Order>({
        id,
      }),
    );
    return this.orderRepository.remove(order);
  }

  // export all.
  async exportAll(findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<StreamableFile> {
    const { data }: { data: Order[] } = await this.findAll(findAllOrdersRequestDto);
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
  async exportAllByCustomerId(authedUser: AuthedUser, customerId: number, findCustomerOrdersRequestDto: FindCustomerOrdersRequestDto): Promise<StreamableFile> {
    const {
      data,
    }: {
      data: Order[];
    } = await this.findAllByCustomerId(authedUser, customerId, findCustomerOrdersRequestDto);
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
  async exportAllByVendorId(authedUser: AuthedUser, vendorId: number, findVendorOrdersRequestDto: FindVendorOrdersRequestDto): Promise<StreamableFile> {
    const { data }: { data: Order[] } = await this.findAllByVendorId(authedUser, vendorId, findVendorOrdersRequestDto);
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
