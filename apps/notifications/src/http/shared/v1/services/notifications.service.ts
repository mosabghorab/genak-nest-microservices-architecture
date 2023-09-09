import { Injectable } from '@nestjs/common';
import { AuthedUser, Notification } from '@app/common';
import { DatabaseNotificationsService } from './database-notifications.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly databaseNotificationsService: DatabaseNotificationsService) {}

  // find all database notification.
  findAllDatabaseNotification(authedUser: AuthedUser): Promise<Notification[]> {
    return this.databaseNotificationsService.findAll(authedUser);
  }
}
