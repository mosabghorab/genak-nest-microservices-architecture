import { Injectable } from '@nestjs/common';
import { SendSmsNotificationDto } from '@app/common';

@Injectable()
export class SmsNotificationsService {
  // send notification.
  sendNotification(sendSmsNotificationDto: SendSmsNotificationDto): void {
    // this is just a dummy code, it will be replaced with sms provider integration.
    console.log(`Sms notification has been sent to ${sendSmsNotificationDto.phone}`);
    console.log(`with message : ${sendSmsNotificationDto.message}`);
  }
}
