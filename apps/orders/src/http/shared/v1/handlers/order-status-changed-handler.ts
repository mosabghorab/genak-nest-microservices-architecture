import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  CreateDatabaseNotificationPayloadDto,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindAllPushTokensPayloadDto,
  FindOneOrFailByIdPayloadDto,
  NotificationsMicroserviceConnection,
  NotificationsMicroserviceConstants,
  NotificationTarget,
  PushNotificationType,
  PushToken,
  RpcAuthenticationPayloadDto,
  SendPushNotificationPayloadDto,
  UserType,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { OrderStatusChangedEvent } from '../events/order-status-changed.event';
import { Constants } from '../../../../constants';

@Injectable()
export class OrderStatusChangedHandler {
  private readonly notificationsMicroserviceConnection: NotificationsMicroserviceConnection;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME)
    private readonly notificationsMicroservice: ClientProxy,
    @Inject(AuthMicroserviceConstants.NAME)
    private readonly authMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceConnection = new NotificationsMicroserviceConnection(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
    this.authMicroserviceConnection = new AuthMicroserviceConnection(authMicroservice, Constants.AUTH_MICROSERVICE_VERSION);
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.ORDER_STATUS_CHANGED_EVENT, { async: true })
  async handle(orderStatusChangedEvent: OrderStatusChangedEvent): Promise<void> {
    await this._sendFcmNotification(orderStatusChangedEvent);
    await this._createDatabaseNotification(orderStatusChangedEvent);
  }

  // send fcm notification.
  private async _sendFcmNotification(orderStatusChangedEvent: OrderStatusChangedEvent): Promise<void> {
    const { authedUser, order }: OrderStatusChangedEvent = orderStatusChangedEvent;
    let pushTokens: string[] = [];
    if (authedUser.type === UserType.VENDOR) {
      const isNotificationsEnabled: boolean = (
        await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new FindOneOrFailByIdPayloadDto<Customer>({
            id: order.customerId,
          }),
        )
      ).notificationsEnabled;
      if (isNotificationsEnabled) {
        pushTokens = (
          await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
            new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
            new FindAllPushTokensPayloadDto({
              tokenableId: order.customerId,
              tokenableType: UserType.CUSTOMER,
            }),
          )
        ).map((fcmToken: PushToken) => fcmToken.token);
      }
    } else if (authedUser.type === UserType.CUSTOMER) {
      const isNotificationsEnabled: boolean = (
        await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new FindOneOrFailByIdPayloadDto<Vendor>({
            id: order.vendorId,
          }),
        )
      ).notificationsEnabled;
      if (isNotificationsEnabled) {
        pushTokens = (
          await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
            new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
            new FindAllPushTokensPayloadDto({
              tokenableId: order.vendorId,
              tokenableType: UserType.VENDOR,
            }),
          )
        ).map((fcmToken: PushToken) => fcmToken.token);
      }
    } else if (authedUser.type === UserType.ADMIN) {
      const customerIsNotificationsEnabled: boolean = (
        await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new FindOneOrFailByIdPayloadDto<Customer>({
            id: order.customerId,
          }),
        )
      ).notificationsEnabled;
      if (customerIsNotificationsEnabled) {
        pushTokens.push(
          ...(
            await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindAllPushTokensPayloadDto({
                tokenableId: order.customerId,
                tokenableType: UserType.CUSTOMER,
              }),
            )
          ).map((fcmToken: PushToken) => fcmToken.token),
        );
      }
      const vendorIsNotificationsEnabled: boolean = (
        await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new FindOneOrFailByIdPayloadDto<Vendor>({
            id: order.vendorId,
          }),
        )
      ).notificationsEnabled;
      if (vendorIsNotificationsEnabled) {
        pushTokens.push(
          ...(
            await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindAllPushTokensPayloadDto({
                tokenableId: order.vendorId,
                tokenableType: UserType.VENDOR,
              }),
            )
          ).map((fcmToken: PushToken) => fcmToken.token),
        );
      }
    }
    if (pushTokens.length > 0) {
      this.notificationsMicroserviceConnection.notificationsServiceImpl.sendFcmNotification(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new SendPushNotificationPayloadDto({
          type: PushNotificationType.TOKENS,
          fcmTokens: pushTokens,
          title: 'Order Status',
          body: `Order status with id ${order.uniqueId} changed to ${order.status} by ${authedUser.type}`,
          notificationTarget: NotificationTarget.ORDER,
          notificationTargetId: order.id,
        }),
      );
    }
  }

  // create database notification.
  private async _createDatabaseNotification(orderStatusChangedEvent: OrderStatusChangedEvent): Promise<void> {
    const { authedUser, order }: OrderStatusChangedEvent = orderStatusChangedEvent;
    if (authedUser.type === UserType.ADMIN) {
      const createDatabaseNotificationPayloadDtoForCustomer: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
        notifiableId: order.customerId,
        notifiableType: UserType.CUSTOMER,
        notificationTarget: NotificationTarget.ORDER,
        notificationTargetId: order.id,
        title: 'Order Status',
        body: `Order status with id ${order.uniqueId} changed to ${order.status} by ${authedUser.type}`,
      });
      const createDatabaseNotificationPayloadDtoForVendor: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
        notifiableId: order.vendorId,
        notifiableType: UserType.VENDOR,
        notificationTarget: NotificationTarget.ORDER,
        notificationTargetId: order.id,
        title: 'Order Status',
        body: `Order status with id ${order.uniqueId} changed to ${order.status} by ${authedUser.type}`,
      });
      this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        createDatabaseNotificationPayloadDtoForCustomer,
      );
      this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        createDatabaseNotificationPayloadDtoForVendor,
      );
    } else {
      let notifiableType: UserType;
      let notifiableId: number;
      if (authedUser.type === UserType.VENDOR) {
        notifiableType = UserType.CUSTOMER;
        notifiableId = order.customerId;
      } else if (authedUser.type === UserType.CUSTOMER) {
        notifiableType = UserType.VENDOR;
        notifiableId = order.vendorId;
      }
      const createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
        notifiableId: notifiableId,
        notifiableType: notifiableType,
        notificationTarget: NotificationTarget.ORDER,
        notificationTargetId: order.id,
        title: 'Order Status',
        body: `Order status with id ${order.uniqueId} changed to ${order.status} by ${authedUser.type}`,
      });
      this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        createDatabaseNotificationPayloadDto,
      );
    }
  }
}
