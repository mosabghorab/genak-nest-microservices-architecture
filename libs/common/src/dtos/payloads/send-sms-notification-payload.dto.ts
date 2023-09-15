export class SendSmsNotificationPayloadDto {
  phone: string;
  message: string;

  constructor(data: { phone: string; message: string }) {
    Object.assign(this, data);
  }
}
