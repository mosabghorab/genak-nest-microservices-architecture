import { Injectable } from '@nestjs/common';
import { SendFcmNotificationDto } from '@app/common';

@Injectable()
export class FcmNotificationsService {
  // send notification.
  sendNotification(sendFcmNotificationDto: SendFcmNotificationDto): void {
    console.log(`Fcm notification has been sent with these info : `);
    console.log(sendFcmNotificationDto.fcmTokens);
    console.log(sendFcmNotificationDto.type);
    console.log(sendFcmNotificationDto.body);
    console.log(sendFcmNotificationDto.title);
    console.log(sendFcmNotificationDto.topic);
  }
}
