import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constants } from '../../../../constants';
import {
  AuthedUser,
  DateHelpers,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  OrderStatus,
  OrderStatusHistory,
  Reason,
  ReasonsMicroserviceConnection,
  ReasonsMicroserviceConstants,
  RpcAuthenticationPayloadDto,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateOrderStatusRequestDto } from '../dtos/update-order-status-request.dto';
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

  // update status.
  async updateStatus(authedUser: AuthedUser, orderId: number, updateOrderStatusRequestDto: UpdateOrderStatusRequestDto): Promise<Order> {
    const order: Order = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Order>({
        id: orderId,
        relations: {
          orderStatusHistories: true,
        },
      }),
    );
    if (updateOrderStatusRequestDto.reasonId) {
      const reason: Reason = await this.reasonsMicroserviceConnection.reasonsServiceImpl.findOneOrFailById(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new FindOneByIdPayloadDto<Reason>({
          id: updateOrderStatusRequestDto.reasonId,
        }),
      );
      updateOrderStatusRequestDto.note = reason.name;
    }
    order.status = updateOrderStatusRequestDto.status;
    if (order.status === OrderStatus.ACCEPTED) {
      order.startTime = new Date();
    } else if (order.status === OrderStatus.COMPLETED) {
      order.endTime = new Date();
      order.averageTimeMinutes = DateHelpers.calculateTimeDifferenceInMinutes(order.startTime, order.endTime);
    }
    order.orderStatusHistories.push(<OrderStatusHistory>{
      orderId,
      orderStatus: updateOrderStatusRequestDto.status,
      reasonId: updateOrderStatusRequestDto.reasonId,
      note: updateOrderStatusRequestDto.note,
    });
    const savedOrder: Order = await this.orderRepository.save(order);
    if (savedOrder) {
      this.eventEmitter.emit(Constants.ORDER_STATUS_CHANGED_EVENT, new OrderStatusChangedEvent(authedUser, savedOrder));
    }
    return savedOrder;
  }
}
