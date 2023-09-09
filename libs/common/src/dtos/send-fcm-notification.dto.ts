import { FcmNotificationType, NotificationTarget } from '@app/common';

export class SendFcmNotificationDto {
  fcmTokens?: string[];
  topic?: string;
  type: FcmNotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  notificationTarget: NotificationTarget;
  notificationTargetId?: number;

  toJsonPayload(): any {
    const payload: any = {
      notification: {
        body: this.body,
        title: this.title,
      },
      data: {
        notificationTarget: this.notificationTarget,
      },
    };
    if (this.imageUrl) {
      payload.notification['imageUrl'] = this.imageUrl;
    }
    if (this.notificationTargetId) {
      payload.data['notificationTargetId'] = this.notificationTargetId.toString();
    }
    if (this.type === FcmNotificationType.FCM_TOKENS) {
      payload['tokens'] = this.fcmTokens;
    }
    return payload;
  }
}
