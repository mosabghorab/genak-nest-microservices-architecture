import { NotificationTarget, PushNotificationType } from '@app/common';

export class SendPushNotificationPayloadDto {
  fcmTokens?: string[];
  topic?: string;
  type: PushNotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  notificationTarget: NotificationTarget;
  notificationTargetId?: number;

  constructor(data: {
    fcmTokens?: string[];
    topic?: string;
    type: PushNotificationType;
    title: string;
    body: string;
    imageUrl?: string;
    notificationTarget: NotificationTarget;
    notificationTargetId?: number;
  }) {
    Object.assign(this, data);
  }

  toPushableJson(): any {
    const data: any = {
      notification: {
        body: this.body,
        title: this.title,
      },
      data: {
        notificationTarget: this.notificationTarget,
      },
    };
    if (this.imageUrl) {
      data.notification['imageUrl'] = this.imageUrl;
    }
    if (this.notificationTargetId) {
      data.data['notificationTargetId'] = this.notificationTargetId.toString();
    }
    if (this.type === PushNotificationType.TOKENS) {
      data['tokens'] = this.fcmTokens;
    }
    return data;
  }
}
