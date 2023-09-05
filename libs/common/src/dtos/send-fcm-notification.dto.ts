import { FcmNotificationType, NotificationTarget } from '@app/common';

export class SendFcmNotificationDto {
  fcmTokens?: string[];
  topic?: string;
  type: FcmNotificationType;
  title: string;
  body: string;
  notificationTarget: NotificationTarget;
  notificationTargetId?: number;
}
