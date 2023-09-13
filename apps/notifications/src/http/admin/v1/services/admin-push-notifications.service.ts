import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PushNotificationType, SendPushNotificationPayloadDto } from '@app/common';
import { firebaseAdmin } from '../../../../firebase-admin-init';
import { Messaging } from 'firebase-admin/lib/messaging';

@Injectable()
export class AdminPushNotificationsService {
  private readonly fcm: Messaging = firebaseAdmin.messaging();

  // send notification.
  async sendNotification(sendPushNotificationPayloadDto: SendPushNotificationPayloadDto): Promise<void> {
    try {
      if (sendPushNotificationPayloadDto.type === PushNotificationType.TOKENS) {
        await this.fcm.sendEachForMulticast(sendPushNotificationPayloadDto.toPushableJson());
      } else {
        await this.fcm.sendToTopic(sendPushNotificationPayloadDto.topic, sendPushNotificationPayloadDto.toPushableJson());
      }
      console.log(sendPushNotificationPayloadDto.toPushableJson());
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
