export abstract class Constants {
  // registered microservices versions.
  static CUSTOMERS_MICROSERVICE_VERSION = '1';
  static VENDORS_MICROSERVICE_VERSION = '1';
  static NOTIFICATIONS_MICROSERVICE_VERSION = '1';
  static AUTH_MICROSERVICE_VERSION = '1';
  static REASONS_MICROSERVICE_VERSION = '1';

  // events.
  static ORDER_CREATED_EVENT = 'order.created';
  static ORDER_STATUS_CHANGED_EVENT = 'order.status.changed';
}
