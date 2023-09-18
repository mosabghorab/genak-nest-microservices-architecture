import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthedUser,
  Customer,
  CustomerAddress,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusHistory,
  RpcAuthenticationPayloadDto,
  ServiceType,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { CreateOrderRequestDto } from '../dtos/create-order-request.dto';
import { CreateOrderItemRequestDto } from '../dtos/create-order-item-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { OrderCreatedEvent } from '../events/order-created.event';

@Injectable()
export class CustomerOrdersService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CustomersMicroserviceConstants.NAME) private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy,
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
  findAll(customerId: number, findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<Order[]> {
    return this.orderRepository.find({
      where: {
        customerId,
        serviceType: findAllOrdersRequestDto.serviceType,
        status: findAllOrdersRequestDto.status,
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
  async create(authedUser: AuthedUser, createOrderRequestDto: CreateOrderRequestDto): Promise<Order> {
    const customer: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: authedUser.id,
      }),
    );
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: createOrderRequestDto.vendorId,
      }),
    );
    await this.customersMicroserviceConnection.customerAddressesServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<CustomerAddress>({
        id: createOrderRequestDto.customerAddressId,
      }),
    );
    const order: Order = await this.orderRepository.create({
      customerId: authedUser.id,
      vendorId: createOrderRequestDto.vendorId,
      customerAddressId: createOrderRequestDto.customerAddressId,
      serviceType: createOrderRequestDto.serviceType,
      note: createOrderRequestDto.note,
      total: createOrderRequestDto.total,
    });
    const savedOrder: Order = await this.orderRepository.save(order);
    savedOrder.orderItems = createOrderRequestDto.orderItems.map((createOrderItemDto: CreateOrderItemRequestDto) => <OrderItem>{ orderId: savedOrder.id, ...createOrderItemDto });
    savedOrder.uniqueId = `${savedOrder.serviceType === ServiceType.WATER ? 'W-' : 'G-'}${new Date().getFullYear()}${savedOrder.id}`;
    savedOrder.orderStatusHistories = [
      <OrderStatusHistory>{
        orderId: savedOrder.id,
        orderStatus: OrderStatus.PENDING,
      },
    ];
    const newOrder: Order = await this.orderRepository.save(savedOrder);
    if (newOrder) {
      this.eventEmitter.emit(Constants.ORDER_CREATED_EVENT, new OrderCreatedEvent(authedUser, newOrder, vendor, customer));
    }
    return newOrder;
  }

  // re order.
  async reOrder(authedUser: AuthedUser, id: number): Promise<Order> {
    const order: Order = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Order>({
        id,
        relations: {
          orderItems: true,
          orderStatusHistories: true,
          customer: true,
          vendor: true,
        },
      }),
    );
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
    const newSavedOrder: Order = await this.orderRepository.save(savedOrder);
    if (newSavedOrder) {
      this.eventEmitter.emit(Constants.ORDER_CREATED_EVENT, new OrderCreatedEvent(authedUser, newSavedOrder, order.vendor, order.customer));
    }
    return newSavedOrder;
  }
}
