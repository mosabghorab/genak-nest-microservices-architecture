import { Injectable } from '@nestjs/common';
import { SendSmsNotificationPayloadDto } from '@app/common';

@Injectable()
export class SmsNotificationsService {
  // send notification.
  sendNotification(sendSmsNotificationPayloadDto: SendSmsNotificationPayloadDto): void {
    // this is just a dummy code, it will be replaced with sms provider integration.
    console.log(`Sms notification has been sent to ${sendSmsNotificationPayloadDto.phone}`);
    console.log(`with message : ${sendSmsNotificationPayloadDto.message}`);
  }
}
