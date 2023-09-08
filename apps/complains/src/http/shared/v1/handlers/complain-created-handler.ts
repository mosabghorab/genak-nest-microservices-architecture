import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  Admin,
  AdminsMicroserviceConnection,
  AdminsMicroserviceConstants,
  AuthMicroserviceConnection,
  AuthMicroserviceConstants,
  CreateDatabaseNotificationDto,
  FcmNotificationType,
  FcmToken,
  FindAllFcmTokensDto,
  NotificationsMicroserviceConstants,
  NotificationsMicroserviceImpl,
  NotificationTarget,
  PermissionGroup,
  SendFcmNotificationDto,
  UserType,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { ComplainCreatedEvent } from '../events/complain-created.event';

@Injectable()
export class ComplainCreatedHandler {
  private readonly notificationsMicroserviceImpl: NotificationsMicroserviceImpl;
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
    this.notificationsMicroserviceImpl = new NotificationsMicroserviceImpl(notificationsMicroservice, Constants.NOTIFICATIONS_MICROSERVICE_VERSION);
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
    const { complain }: ComplainCreatedEvent = complainCreatedEvent;
    const admins: Admin[] = await this.adminsMicroserviceConnection.adminsServiceImpl.findAllByPermissionGroup(PermissionGroup.COMPLAINS);
    if (admins && admins.length > 0) {
      const fcmTokens: string[] = [];
      for (const admin of admins) {
        if (admin.notificationsEnabled) {
          const fcmTokensForAdmin: string[] = (
            await this.authMicroserviceConnection.fcmTokensServiceImpl.findAll(<FindAllFcmTokensDto>{
              tokenableId: admin.id,
              tokenableType: UserType.ADMIN,
            })
          ).map((fcmToken: FcmToken) => fcmToken.token);
          fcmTokens.push(...fcmTokensForAdmin);
        }
      }
      if (fcmTokens.length > 0) {
        this.notificationsMicroserviceImpl.sendFcmNotification(<SendFcmNotificationDto>{
          type: FcmNotificationType.FCM_TOKENS,
          fcmTokens: fcmTokens,
          title: 'New Complain',
          body: `New complain created by ${complain.complainerUserType}`,
          notificationTarget: NotificationTarget.COMPLAIN,
          notificationTargetId: complain.id,
        });
      }
    }
  }

  // create database notification.
  private async _createDatabaseNotification(complainCreatedEvent: ComplainCreatedEvent): Promise<void> {
    const { complain }: ComplainCreatedEvent = complainCreatedEvent;
    const admins: Admin[] = await this.adminsMicroserviceConnection.adminsServiceImpl.findAllByPermissionGroup(PermissionGroup.COMPLAINS);
    if (admins && admins.length > 0) {
      for (const admin of admins) {
        const createDatabaseNotificationDto: CreateDatabaseNotificationDto = <CreateDatabaseNotificationDto>{
          notifiableId: admin.id,
          notifiableType: UserType.ADMIN,
          notificationTarget: NotificationTarget.COMPLAIN,
          notificationTargetId: complain.id,
          title: 'New Complain',
          body: `New complain created by ${complain.complainerUserType}`,
        };
        this.notificationsMicroserviceImpl.createDatabaseNotification(createDatabaseNotificationDto);
      }
    }
  }
}
