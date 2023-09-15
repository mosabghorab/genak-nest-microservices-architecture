import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  ClientUserType,
  CreateDatabaseNotificationPayloadDto,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FcmToken,
  FindAllPushTokensPayloadDto,
  FindOneOrFailByIdPayloadDto,
  NotificationsMicroserviceConnection,
  NotificationsMicroserviceConstants,
  NotificationTarget,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  PushNotificationType,
  SendPushNotificationPayloadDto,
  UserType,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ComplainStatusChangedEvent } from '../events/complain-status-changed.event';
import { Constants } from '../../../../constants';

@Injectable()
export class ComplainStatusChangedHandler {
  private readonly notificationsMicroserviceConnection: NotificationsMicroserviceConnection;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME)
    private readonly notificationsMicroservice: ClientProxy,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
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
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.COMPLAIN_STATUS_CHANGED_EVENT, { async: true })
  async handle(complainStatusChangedEvent: ComplainStatusChangedEvent): Promise<void> {
    await this._sendFcmNotification(complainStatusChangedEvent);
    await this._createDatabaseNotification(complainStatusChangedEvent);
  }

  // send fcm notification.
  private async _sendFcmNotification(complainStatusChangedEvent: ComplainStatusChangedEvent): Promise<void> {
    const { complain }: ComplainStatusChangedEvent = complainStatusChangedEvent;
    let fcmTokens: string[] = [];
    if (complain.complainerUserType === ClientUserType.CUSTOMER) {
      const isNotificationsEnabled: boolean = (
        await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
          new FindOneOrFailByIdPayloadDto<Customer>({
            id: complain.complainerId,
          }),
        )
      ).notificationsEnabled;
      if (isNotificationsEnabled) {
        const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(
          new FindOneOrFailByIdPayloadDto<Order>({
            id: complain.orderId,
          }),
        );
        fcmTokens = (
          await this.authMicroserviceConnection.fcmTokensServiceImpl.findAll(
            new FindAllPushTokensPayloadDto({
              tokenableId: complain.complainerId,
              tokenableType: UserType.CUSTOMER,
            }),
          )
        ).map((fcmToken: FcmToken): string => fcmToken.token);
        if (fcmTokens.length > 0) {
          this.notificationsMicroserviceConnection.notificationsServiceImpl.sendFcmNotification(
            new SendPushNotificationPayloadDto({
              type: PushNotificationType.TOKENS,
              fcmTokens: fcmTokens,
              title: 'Complain Status',
              body: `Complain status with order id ${order.uniqueId} changed to ${complain.status}`,
              notificationTarget: NotificationTarget.COMPLAIN,
              notificationTargetId: complain.id,
            }),
          );
        }
      }
    } else {
      const isNotificationsEnabled: boolean = (
        await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
          new FindOneOrFailByIdPayloadDto<Vendor>({
            id: complain.complainerId,
          }),
        )
      ).notificationsEnabled;
      if (isNotificationsEnabled) {
        const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(
          new FindOneOrFailByIdPayloadDto<Order>({
            id: complain.orderId,
          }),
        );
        fcmTokens = (
          await this.authMicroserviceConnection.fcmTokensServiceImpl.findAll(
            new FindAllPushTokensPayloadDto({
              tokenableId: complain.complainerId,
              tokenableType: UserType.VENDOR,
            }),
          )
        ).map((fcmToken: FcmToken): string => fcmToken.token);
        if (fcmTokens.length > 0) {
          this.notificationsMicroserviceConnection.notificationsServiceImpl.sendFcmNotification(
            new SendPushNotificationPayloadDto({
              type: PushNotificationType.TOKENS,
              fcmTokens: fcmTokens,
              title: 'Complain Status',
              body: `Complain status with order id ${order.uniqueId} changed to ${complain.status}`,
              notificationTarget: NotificationTarget.COMPLAIN,
              notificationTargetId: complain.id,
            }),
          );
        }
      }
    }
  }

  // create database notification.
  private async _createDatabaseNotification(complainStatusChangedEvent: ComplainStatusChangedEvent): Promise<void> {
    const { complain }: ComplainStatusChangedEvent = complainStatusChangedEvent;
    const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Order>({
        id: complain.orderId,
      }),
    );
    let userType: UserType;
    if (complain.complainerUserType === ClientUserType.CUSTOMER) {
      userType = UserType.CUSTOMER;
    } else {
      userType = UserType.VENDOR;
    }
    const createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
      notifiableId: complain.complainerId,
      notifiableType: userType,
      notificationTarget: NotificationTarget.COMPLAIN,
      notificationTargetId: complain.id,
      title: 'Complain Status',
      body: `Complain status with order id ${order.uniqueId} changed to ${complain.status}`,
    });
    this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(createDatabaseNotificationPayloadDto);
  }
}
