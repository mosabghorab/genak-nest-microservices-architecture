export abstract class NotificationsMicroserviceConstants {
  static NAME = 'notifications';
  static CONFIG_NAME = 'NOTIFICATIONS';

  static NOTIFICATIONS_SERVICE_SEND_FCM_NOTIFICATION_EVENT_PATTERN = 'notificationsService.sendFcmNotification';
  static NOTIFICATIONS_SERVICE_SEND_SMS_NOTIFICATION_EVENT_PATTERN = 'notificationsService.sendSmsNotification';
  static NOTIFICATIONS_SERVICE_CREATE_DATABASE_NOTIFICATION_EVENT_PATTERN = 'notificationsService.createDatabaseNotification';
}
