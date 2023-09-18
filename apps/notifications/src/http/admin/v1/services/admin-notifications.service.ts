import { AdminPushNotificationsService } from './admin-push-notifications.service';
import { Inject, Injectable } from '@nestjs/common';
import { SendPushNotificationRequestDto } from '../dtos/send-push-notification-request.dto';
import {
  Admin,
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  AuthedUser,
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindAllPushTokensPayloadDto,
  FindOneOrFailByIdPayloadDto,
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
import { Constants } from '../../../../constants';

@Injectable()
export class AdminNotificationsService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;

  constructor(
    private readonly adminPushNotificationsService: AdminPushNotificationsService,
    @Inject(CustomersMicroserviceConstants.NAME) private readonly customersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy,
    @Inject(AdminsMicroserviceConstants.NAME) private readonly adminsMicroservice: ClientProxy,
    @Inject(AuthMicroserviceConstants.NAME) private readonly authMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
    this.authMicroserviceConnection = new AuthMicroserviceConnection(authMicroservice, Constants.AUTH_MICROSERVICE_VERSION);
  }

  // send push notification.
  async sendPushNotification(authedUser: AuthedUser, sendPushNotificationRequestDto: SendPushNotificationRequestDto): Promise<void> {
    if (sendPushNotificationRequestDto.userType) {
      const pushTokens: string[] = [];
      for (const userId of sendPushNotificationRequestDto.usersIds) {
        let notificationsEnabled: boolean;
        if (sendPushNotificationRequestDto.userType === UserType.CUSTOMER) {
          notificationsEnabled = (
            await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindOneOrFailByIdPayloadDto<Customer>({
                id: userId,
              }),
            )
          ).notificationsEnabled;
        } else if (sendPushNotificationRequestDto.userType === UserType.VENDOR) {
          notificationsEnabled = (
            await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindOneOrFailByIdPayloadDto<Vendor>({
                id: userId,
              }),
            )
          ).notificationsEnabled;
        } else if (sendPushNotificationRequestDto.userType === UserType.ADMIN) {
          notificationsEnabled = (
            await this.adminsMicroserviceConnection.adminsServiceImpl.findOneOrFailById(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindOneOrFailByIdPayloadDto<Admin>({
                id: userId,
              }),
            )
          ).notificationsEnabled;
        }
        if (!notificationsEnabled) continue;
        pushTokens.push(
          ...(
            await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindAllPushTokensPayloadDto({
                tokenableId: userId,
                tokenableType: sendPushNotificationRequestDto.userType,
              }),
            )
          ).map((fcmToken: PushToken) => fcmToken.token),
        );
      }
      if (pushTokens.length > 0) {
        await this.adminPushNotificationsService.sendNotification(
          new SendPushNotificationPayloadDto({
            type: PushNotificationType.TOKENS,
            notificationTarget: NotificationTarget.GENERAL,
            fcmTokens: pushTokens,
            title: sendPushNotificationRequestDto.title,
            body: sendPushNotificationRequestDto.body,
            imageUrl: sendPushNotificationRequestDto.imageUrl,
          }),
        );
      }
    } else {
      await this.adminPushNotificationsService.sendNotification(
        new SendPushNotificationPayloadDto({
          type: PushNotificationType.TOPIC,
          notificationTarget: NotificationTarget.GENERAL,
          topic: sendPushNotificationRequestDto.topic,
          title: sendPushNotificationRequestDto.title,
          body: sendPushNotificationRequestDto.body,
          imageUrl: sendPushNotificationRequestDto.imageUrl,
        }),
      );
    }
  }
}
