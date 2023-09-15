import { NotificationTarget, UserType } from '@app/common';

export class CreateDatabaseNotificationPayloadDto {
  notifiableId: number;
  notifiableType: UserType;
  notificationTarget: NotificationTarget;
  notificationTargetId?: number;
  title: string;
  body: string;

  constructor(data: { notifiableId: number; notifiableType: UserType; notificationTarget: NotificationTarget; notificationTargetId?: number; title: string; body: string }) {
    Object.assign(this, data);
  }
}
