import { Body, Controller, Post } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, EmptyDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminNotificationsService } from '../services/admin-notifications.service';
import { SendPushNotificationRequestDto } from '../dtos/send-push-notification-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.NOTIFICATIONS)
@Controller({ path: 'admin/notifications', version: '1' })
export class AdminNotificationsController {
  constructor(private readonly adminNotificationsService: AdminNotificationsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(EmptyDto, 'Push notification sent successfully.')
  @Post('send-push-notification')
  sendPushNotification(@Body() sendPushNotificationRequestDto: SendPushNotificationRequestDto): Promise<void> {
    return this.adminNotificationsService.sendPushNotification(sendPushNotificationRequestDto);
  }
}
