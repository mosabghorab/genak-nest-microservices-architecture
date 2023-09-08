export abstract class VendorsMicroserviceConstants {
  static NAME = 'vendors';
  static CONFIG_NAME = 'VENDORS';

  // messages pattern for [Vendors Service].
  static VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'vendorsService.findOneById';
  static VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN = 'vendorsService.findOneByPhone';
  static VENDORS_SERVICE_CREATE_MESSAGE_PATTERN = 'vendorsService.create';
  static VENDORS_SERVICE_UPLOAD_DOCUMENTS_MESSAGE_PATTERN = 'vendorsService.uploadDocuments';
  static VENDORS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN = 'vendorsService.removeOneByInstance';
  static VENDORS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN = 'vendorsService.updateProfile';
  static VENDORS_SERVICE_COUNT_MESSAGE_PATTERN = 'vendorsService.count';
  static VENDORS_SERVICE_FIND_LATEST_MESSAGE_PATTERN = 'vendorsService.findLatest';
  static VENDORS_SERVICE_FIND_BEST_SELLERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN = 'vendorsService.findBestSellersWithOrdersCount';
}
