import { ClientProxy } from '@nestjs/microservices';
import { NotificationsServiceImpl } from '@app/common';

export class NotificationsMicroserviceConnection {
  public readonly notificationsServiceImpl: NotificationsServiceImpl;

  constructor(private readonly notificationsMicroservice: ClientProxy, private readonly version: string) {
    this.notificationsServiceImpl = new NotificationsServiceImpl(notificationsMicroservice, version);
  }
}
