import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  CreateDatabaseNotificationDto,
  FcmNotificationType,
  FcmToken,
  FindAllFcmTokensDto,
  NotificationsMicroserviceConstants,
  NotificationsMicroserviceImpl,
  NotificationTarget,
  SendFcmNotificationDto,
  UserType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { Constants } from '../../../../constants';

@Injectable()
export class OrderCreatedHandler {
  private readonly notificationsMicroserviceImpl: NotificationsMicroserviceImpl;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME) private readonly notificationsMicroservice: ClientProxy,
    @Inject(AuthMicroserviceConstants.NAME) private readonly authMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceImpl = new NotificationsMicroserviceImpl(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
    this.authMicroserviceConnection = new AuthMicroserviceConnection(authMicroservice, Constants.AUTH_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.ORDER_CREATED_EVENT, { async: true })
  async handle(orderCreatedEvent: OrderCreatedEvent): Promise<void> {
    await this._sendFcmNotification(orderCreatedEvent);
    await this._createDatabaseNotification(orderCreatedEvent);
  }

  // send fcm notification.
  private async _sendFcmNotification(orderCreatedEvent: OrderCreatedEvent): Promise<void> {
    const { order, vendor, customer }: OrderCreatedEvent = orderCreatedEvent;
    let fcmTokens: string[] = [];
    if (vendor.notificationsEnabled) {
      fcmTokens = (
        await this.authMicroserviceConnection.fcmTokensServiceImpl.findAll(<FindAllFcmTokensDto>{
          tokenableId: vendor.id,
          tokenableType: UserType.VENDOR,
        })
      ).map((fcmToken: FcmToken) => fcmToken.token);
      if (fcmTokens.length > 0) {
        this.notificationsMicroserviceImpl.sendFcmNotification(<SendFcmNotificationDto>{
          type: FcmNotificationType.FCM_TOKENS,
          fcmTokens: fcmTokens,
          title: 'New Order',
          body: `You got a new order from: ${customer.name}`,
          notificationTarget: NotificationTarget.ORDER,
          notificationTargetId: order.id,
        });
      }
    }
  }

  // create database notification.
  private async _createDatabaseNotification(orderStatusChangedEvent: OrderCreatedEvent): Promise<void> {
    const { order, vendor, customer }: OrderCreatedEvent = orderStatusChangedEvent;
    const createDatabaseNotificationDto: CreateDatabaseNotificationDto = <CreateDatabaseNotificationDto>{
      notifiableId: vendor.id,
      notifiableType: UserType.VENDOR,
      notificationTarget: NotificationTarget.ORDER,
      notificationTargetId: order.id,
      title: 'New Order',
      body: `You got a new order from: ${customer.name}`,
    };
    this.notificationsMicroserviceImpl.createDatabaseNotification(createDatabaseNotificationDto);
  }
}
