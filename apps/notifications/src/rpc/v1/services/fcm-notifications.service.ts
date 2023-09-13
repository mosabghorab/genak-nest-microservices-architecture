import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PushNotificationType, SendPushNotificationPayloadDto } from '@app/common';
import { firebaseAdmin } from '../../../firebase-admin-init';
import { Messaging } from 'firebase-admin/lib/messaging';

@Injectable()
export class FcmNotificationsService {
  private readonly fcm: Messaging = firebaseAdmin.messaging();

  // send notification.
  async sendNotification(sendFcmNotificationDto: SendPushNotificationPayloadDto): Promise<void> {
    try {
      if (sendFcmNotificationDto.type === PushNotificationType.TOKENS) {
        await this.fcm.sendEachForMulticast(sendFcmNotificationDto.toPushableJson());
      } else {
        await this.fcm.sendToTopic(sendFcmNotificationDto.topic, sendFcmNotificationDto.toPushableJson());
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
