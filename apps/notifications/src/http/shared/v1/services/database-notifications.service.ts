import { Inject, Injectable } from '@nestjs/common';
import {
  AuthedUser,
  Complain,
  ComplainsMicroserviceConnection,
  ComplainsMicroserviceConstants,
  FindOneByIdDto,
  Notification,
  NotificationTarget,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
} from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class DatabaseNotificationsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly complainsMicroserviceConnection: ComplainsMicroserviceConnection;

  constructor(
    @InjectRepository(Notification) private readonly notificationRepository: Repository<Notification>,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(ComplainsMicroserviceConstants.NAME)
    private readonly complainsMicroservice: ClientProxy,
  ) {
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.complainsMicroserviceConnection = new ComplainsMicroserviceConnection(complainsMicroservice, Constants.COMPLAINS_MICROSERVICE_VERSION);
  }

  // find all.
  async findAll(authedUser: AuthedUser): Promise<Notification[]> {
    const notifications: Notification[] = await this.notificationRepository.find({
      where: {
        notifiableId: authedUser.id,
        notifiableType: authedUser.type,
      },
    });
    for (const notification of notifications) {
      if (notification.notificationTarget === NotificationTarget.ORDER) {
        notification['order'] = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneById(<FindOneByIdDto<Order>>{
          id: notification.notificationTargetId,
        });
      } else if (notification.notificationTarget === NotificationTarget.COMPLAIN) {
        notification['complain'] = await this.complainsMicroserviceConnection.complainsServiceImpl.findOneById(<FindOneByIdDto<Complain>>{
          id: notification.notificationTargetId,
        });
      }
    }
    return notifications;
  }
}
