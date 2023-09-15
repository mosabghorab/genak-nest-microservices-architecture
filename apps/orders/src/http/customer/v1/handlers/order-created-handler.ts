import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  CreateDatabaseNotificationPayloadDto,
  FcmToken,
  FindAllPushTokensPayloadDto,
  NotificationsMicroserviceConnection,
  NotificationsMicroserviceConstants,
  NotificationTarget,
  PushNotificationType,
  SendPushNotificationPayloadDto,
  UserType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderCreatedEvent } from '../events/order-created.event';
import { Constants } from '../../../../constants';

@Injectable()
export class OrderCreatedHandler {
  private readonly notificationsMicroserviceConnection: NotificationsMicroserviceConnection;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME) private readonly notificationsMicroservice: ClientProxy,
    @Inject(AuthMicroserviceConstants.NAME) private readonly authMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceConnection = new NotificationsMicroserviceConnection(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
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
        await this.authMicroserviceConnection.fcmTokensServiceImpl.findAll(
          new FindAllPushTokensPayloadDto({
            tokenableId: vendor.id,
            tokenableType: UserType.VENDOR,
          }),
        )
      ).map((fcmToken: FcmToken) => fcmToken.token);
      if (fcmTokens.length > 0) {
        this.notificationsMicroserviceConnection.notificationsServiceImpl.sendFcmNotification(
          new SendPushNotificationPayloadDto({
            type: PushNotificationType.TOKENS,
            fcmTokens: fcmTokens,
            title: 'z',
            body: `You got a new order from: ${customer.name}`,
            notificationTarget: NotificationTarget.ORDER,
            notificationTargetId: order.id,
          }),
        );
      }
    }
  }

  // create database notification.
  private async _createDatabaseNotification(orderStatusChangedEvent: OrderCreatedEvent): Promise<void> {
    const { order, vendor, customer }: OrderCreatedEvent = orderStatusChangedEvent;
    const createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
      notifiableId: vendor.id,
      notifiableType: UserType.VENDOR,
      notificationTarget: NotificationTarget.ORDER,
      notificationTargetId: order.id,
      title: 'New Order',
      body: `You got a new order from: ${customer.name}`,
    });
    this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(createDatabaseNotificationPayloadDto);
  }
}
