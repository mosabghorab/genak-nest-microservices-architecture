export abstract class CustomersMicroserviceConstants {
  static NAME = 'customers';
  static CONFIG_NAME = 'CUSTOMERS';

  // messages pattern for [Customers Service].
  static CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'customersService.findOneById';
  static CUSTOMERS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN = 'customersService.findOneByPhone';
  static CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN = 'customersService.create';
  static CUSTOMERS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN = 'customersService.removeOneByInstance';
  static CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN = 'customersService.updateProfile';
  static CUSTOMERS_SERVICE_COUNT_MESSAGE_PATTERN = 'customersService.count';
  static CUSTOMERS_SERVICE_FIND_BEST_BUYERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN = 'customersService.findBestBuyersWithOrdersCount';

  // messages pattern for [Customer Addresses Service].
  static CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'customerAddressesService.findOneById';
}
