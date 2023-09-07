import { Controller, Get } from '@nestjs/common';
import { AllowFor, AuthedUser, GetAuthedUser, Notification, NotificationDto, Serialize, SkipAdminRoles, UserType } from '@app/common';
import { NotificationsService } from '../services/notifications.service';

@AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
@SkipAdminRoles()
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Serialize(NotificationDto, 'All notifications.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser): Promise<Notification[]> {
    return this.notificationsService.findAllDatabaseNotification(authedUser);
  }
}
