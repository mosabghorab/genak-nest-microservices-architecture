import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FcmNotificationType, SendFcmNotificationDto } from '@app/common';
import { firebaseAdmin } from '../../../firebase-admin-init';
import { Messaging } from 'firebase-admin/lib/messaging';

@Injectable()
export class FcmNotificationsService {
  private readonly fcm: Messaging = firebaseAdmin.messaging();

  // send notification.
  async sendNotification(sendFcmNotificationDto: SendFcmNotificationDto): Promise<void> {
    try {
      if (sendFcmNotificationDto.type === FcmNotificationType.FCM_TOKENS) {
        await this.fcm.sendEachForMulticast(sendFcmNotificationDto.toJsonPayload());
      } else {
        await this.fcm.sendToTopic(sendFcmNotificationDto.topic, sendFcmNotificationDto.toJsonPayload());
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
