import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Customer,
  CustomerAddress,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusHistory,
  ServiceType,
  Vendor,
  VendorsMicroserviceConstants,
  VendorsMicroserviceImpl,
} from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class CustomerOrdersService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CustomersMicroserviceConstants.NAME) private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
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
  findAll(customerId: number, findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        customerId,
        serviceType: findAllOrdersDto.serviceType,
        status: findAllOrdersDto.status,
      },
      relations: {
        vendor: true,
        customerAddress: true,
        orderItems: true,
        orderStatusHistories: true,
      },
    });
  }

  // create.
  async create(customerId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const customer: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
    const vendor: Vendor = await this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: createOrderDto.vendorId,
    });
    const customerAddress: CustomerAddress = await this.customersMicroserviceConnection.customerAddressesServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<CustomerAddress>>{
      id: createOrderDto.customerAddressId,
    });
    const order: Order = await this.orderRepository.create({
      customerId,
      vendorId: createOrderDto.vendorId,
      customerAddressId: createOrderDto.customerAddressId,
      serviceType: createOrderDto.serviceType,
      note: createOrderDto.note,
      total: createOrderDto.total,
    });
    order.vendor = vendor;
    order.customerAddress = customerAddress;
    const savedOrder: Order = await this.orderRepository.save(order);
    savedOrder.orderItems = createOrderDto.orderItems.map((createOrderItemDto: CreateOrderItemDto) => <OrderItem>{ orderId: savedOrder.id, ...createOrderItemDto });
    savedOrder.uniqueId = `${savedOrder.serviceType === ServiceType.WATER ? 'W-' : 'G-'}${new Date().getFullYear()}${savedOrder.id}`;
    savedOrder.orderStatusHistories = [
      <OrderStatusHistory>{
        orderId: savedOrder.id,
        orderStatus: OrderStatus.PENDING,
      },
    ];
    const newOrder: Order = await this.orderRepository.save(savedOrder);
    if (newOrder) {
      this.eventEmitter.emit(Constants.ORDER_CREATED_EVENT, new OrderCreatedEvent(newOrder, vendor, customer));
    }
    return newOrder;
  }

  // re order.
  async reOrder(id: number): Promise<Order> {
    const order: Order = await this.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id,
      relations: {
        orderItems: true,
        orderStatusHistories: true,
      },
    });
    const newOrder: Order = await this.orderRepository.create({
      customerId: order.customerId,
      vendorId: order.vendorId,
      customerAddressId: order.customerAddressId,
      serviceType: order.serviceType,
      note: order.note,
      total: order.total,
    });
    const savedOrder: Order = await this.orderRepository.save(newOrder);
    savedOrder.orderItems = order.orderItems.map((e: OrderItem) => {
      e.id = null;
      return <OrderItem>{ orderId: savedOrder.id, ...e };
    });
    savedOrder.uniqueId = `${savedOrder.serviceType === ServiceType.WATER ? 'W-' : 'G-'}${new Date().getFullYear()}${savedOrder.id}`;
    savedOrder.orderStatusHistories = [
      <OrderStatusHistory>{
        orderId: savedOrder.id,
        orderStatus: OrderStatus.PENDING,
      },
    ];
    return this.orderRepository.save(savedOrder);
  }
}
