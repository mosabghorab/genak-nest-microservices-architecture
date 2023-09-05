import { NotificationTarget, UserType } from '@app/common';

export class CreateDatabaseNotificationDto {
  notifiableId: number;
  notifiableType: UserType;
  notificationTarget: NotificationTarget;
  notificationTargetId?: number;
  title: string;
  body: string;
}
