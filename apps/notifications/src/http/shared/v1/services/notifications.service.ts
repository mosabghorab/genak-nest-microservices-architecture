import { Injectable } from '@nestjs/common';
import { AuthedUser, Notification } from '@app/common';
import { FcmNotificationsService } from '../services/fcm-notifications.service';
import { DatabaseNotificationsService } from '../services/database-notifications.service';
import { SmsNotificationsService } from '../services/sms-notifications.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly fcmNotificationsService: FcmNotificationsService,
    private readonly databaseNotificationsService: DatabaseNotificationsService,
    private readonly smsNotificationsService: SmsNotificationsService,
  ) {}

  // find all database notification.
  findAllDatabaseNotification(authedUser: AuthedUser): Promise<Notification[]> {
    return this.databaseNotificationsService.findAll(authedUser);
  }
}
