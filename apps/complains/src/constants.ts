export abstract class Constants {
  static COMPLAINS_IMAGES_PREFIX_PATH = 'complains-images/';

  // registered microservices versions.
  static ORDERS_MICROSERVICE_VERSION = '1';
  static VENDORS_MICROSERVICE_VERSION = '1';
  static CUSTOMERS_MICROSERVICE_VERSION = '1';
  static NOTIFICATIONS_MICROSERVICE_VERSION = '1';
  static AUTH_MICROSERVICE_VERSION = '1';
  static STORAGE_MICROSERVICE_VERSION = '1';
  static ADMINS_MICROSERVICE_VERSION = '1';

  // events.
  static COMPLAIN_CREATED_EVENT = 'complain.created';
  static COMPLAIN_STATUS_CHANGED_EVENT = 'complain.status.changed';
}
