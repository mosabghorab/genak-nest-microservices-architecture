import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Admin,
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  CreateDatabaseNotificationPayloadDto,
  FindAllPushTokensPayloadDto,
  NotificationsMicroserviceConnection,
  NotificationsMicroserviceConstants,
  NotificationTarget,
  PermissionGroup,
  PushNotificationType,
  PushToken,
  RpcAuthenticationPayloadDto,
  SendPushNotificationPayloadDto,
  UserType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { ComplainCreatedEvent } from '../events/complain-created.event';

@Injectable()
export class ComplainCreatedHandler {
  private readonly notificationsMicroserviceConnection: NotificationsMicroserviceConnection;
  private readonly authMicroserviceConnection: AuthMicroserviceConnection;
  private readonly adminsMicroserviceConnection: AdminsMicroserviceConnection;

  constructor(
    @Inject(NotificationsMicroserviceConstants.NAME)
    private readonly notificationsMicroservice: ClientProxy,
    @Inject(AuthMicroserviceConstants.NAME)
    private readonly authMicroservice: ClientProxy,
    @Inject(AdminsMicroserviceConstants.NAME)
    private readonly adminsMicroservice: ClientProxy,
  ) {
    this.notificationsMicroserviceConnection = new NotificationsMicroserviceConnection(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
    this.authMicroserviceConnection = new AuthMicroserviceConnection(authMicroservice, Constants.AUTH_MICROSERVICE_VERSION);
    this.adminsMicroserviceConnection = new AdminsMicroserviceConnection(adminsMicroservice, Constants.ADMINS_MICROSERVICE_VERSION);
  }

  // handle.
  @OnEvent(Constants.COMPLAIN_CREATED_EVENT, { async: true })
  async handle(complainCreatedEvent: ComplainCreatedEvent): Promise<void> {
    await this._sendFcmNotification(complainCreatedEvent);
    await this._createDatabaseNotification(complainCreatedEvent);
  }

  // send fcm notification.
  private async _sendFcmNotification(complainCreatedEvent: ComplainCreatedEvent): Promise<void> {
    const { authedUser, complain }: ComplainCreatedEvent = complainCreatedEvent;
    const admins: Admin[] = await this.adminsMicroserviceConnection.adminsServiceImpl.findAllByPermissionGroup(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      PermissionGroup.COMPLAINS,
    );
    if (admins && admins.length > 0) {
      const fcmTokens: string[] = [];
      for (const admin of admins) {
        if (admin.notificationsEnabled) {
          const fcmTokensForAdmin: string[] = (
            await this.authMicroserviceConnection.pushTokensServiceImpl.findAll(
              new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
              new FindAllPushTokensPayloadDto({
                tokenableId: admin.id,
                tokenableType: UserType.ADMIN,
              }),
            )
          ).map((fcmToken: PushToken) => fcmToken.token);
          fcmTokens.push(...fcmTokensForAdmin);
        }
      }
      if (fcmTokens.length > 0) {
        this.notificationsMicroserviceConnection.notificationsServiceImpl.sendFcmNotification(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new SendPushNotificationPayloadDto({
            type: PushNotificationType.TOKENS,
            fcmTokens: fcmTokens,
            title: 'New Complain',
            body: `New complain created by ${complain.complainerUserType}`,
            notificationTarget: NotificationTarget.COMPLAIN,
            notificationTargetId: complain.id,
          }),
        );
      }
    }
  }

  // create database notification.
  private async _createDatabaseNotification(complainCreatedEvent: ComplainCreatedEvent): Promise<void> {
    const { authedUser, complain }: ComplainCreatedEvent = complainCreatedEvent;
    const admins: Admin[] = await this.adminsMicroserviceConnection.adminsServiceImpl.findAllByPermissionGroup(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      PermissionGroup.COMPLAINS,
    );
    if (admins && admins.length > 0) {
      for (const admin of admins) {
        const createDatabaseNotificationPayloadDto: CreateDatabaseNotificationPayloadDto = new CreateDatabaseNotificationPayloadDto({
          notifiableId: admin.id,
          notifiableType: UserType.ADMIN,
          notificationTarget: NotificationTarget.COMPLAIN,
          notificationTargetId: complain.id,
          title: 'New Complain',
          body: `New complain created by ${complain.complainerUserType}`,
        });
        this.notificationsMicroserviceConnection.notificationsServiceImpl.createDatabaseNotification(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          createDatabaseNotificationPayloadDto,
        );
      }
    }
  }
}
