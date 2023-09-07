import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constants } from '../../../../constants';
import {
  AuthedUser,
  DateHelpers,
  FindOneByIdDto,
  FindOneOrFailByIdDto,
  Order,
  OrderStatus,
  OrderStatusHistory,
  Reason,
  ReasonsMicroserviceConnection,
  ReasonsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';
import { OrderStatusChangedEvent } from '../events/order-status-changed.event';

@Injectable()
export class OrdersService {
  private readonly reasonsMicroserviceConnection: ReasonsMicroserviceConnection;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
    @Inject(ReasonsMicroserviceConstants.NAME)
    private readonly reasonsMicroservice: ClientProxy,
  ) {
    this.reasonsMicroserviceConnection = new ReasonsMicroserviceConnection(reasonsMicroservice, Constants.REASONS_MICROSERVICE_VERSION);
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

  // update status.
  async updateStatus(authedUser: AuthedUser, orderId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order: Order = await this.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id: orderId,
      relations: {
        orderStatusHistories: true,
      },
    });
    if (updateOrderStatusDto.reasonId) {
      const reason: Reason = await this.reasonsMicroserviceConnection.reasonsServiceImpl.findOneOrFailById(<FindOneByIdDto<Reason>>{
        id: updateOrderStatusDto.reasonId,
      });
      updateOrderStatusDto.note = reason.name;
    }
    order.status = updateOrderStatusDto.status;
    if (order.status === OrderStatus.ACCEPTED) {
      order.startTime = new Date();
    } else if (order.status === OrderStatus.COMPLETED) {
      order.endTime = new Date();
      order.averageTimeMinutes = DateHelpers.calculateTimeDifferenceInMinutes(order.startTime, order.endTime);
    }
    order.orderStatusHistories.push(<OrderStatusHistory>{
      orderId,
      orderStatus: updateOrderStatusDto.status,
      reasonId: updateOrderStatusDto.reasonId,
      note: updateOrderStatusDto.note,
    });
    const savedOrder: Order = await this.orderRepository.save(order);
    if (savedOrder) {
      this.eventEmitter.emit(Constants.ORDER_STATUS_CHANGED_EVENT, new OrderStatusChangedEvent(authedUser, savedOrder));
    }
    return savedOrder;
  }
}
