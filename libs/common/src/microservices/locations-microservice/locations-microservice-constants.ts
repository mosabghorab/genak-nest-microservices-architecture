export abstract class LocationsMicroserviceConstants {
  static NAME = 'locations';
  static CONFIG_NAME = 'LOCATIONS';

  // messages pattern for [Locations Service].
  static LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'locationsService.findOneById';
  static LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_AND_CUSTOMERS_AND_ORDERS_COUNT_MESSAGE_PATTERN = 'locationsService.findGovernoratesWithVendorsAndCustomersAndOrdersCount';
  static LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_ORDERS_COUNT_MESSAGE_PATTERN = 'locationsService.findGovernoratesWithOrdersCount';
  static LOCATIONS_SERVICE_FIND_REGIONS_WITH_ORDERS_COUNT_MESSAGE_PATTERN = 'locationsService.findRegionsWithOrdersCount';
  static LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_VENDORS_COUNT_MESSAGE_PATTERN = 'locationsService.findGovernoratesWithVendorsCount';
  static LOCATIONS_SERVICE_FIND_GOVERNORATES_WITH_CUSTOMERS_COUNT_MESSAGE_PATTERN = 'locationsService.findGovernoratesWithCustomersCount';
}
