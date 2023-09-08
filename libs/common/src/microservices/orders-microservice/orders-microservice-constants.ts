export abstract class OrdersMicroserviceConstants {
  static NAME = 'orders';
  static CONFIG_NAME = 'ORDERS';

  // messages pattern for [Orders Service].
  static ORDERS_SERVICE_FIND_ONE_BY_ID_AND_SERVICE_TYPE_MESSAGE_PATTERN = 'ordersService.findOneByIdAndServiceType';
  static ORDERS_SERVICE_COUNT_MESSAGE_PATTERN = 'ordersService.count';
  static ORDERS_SERVICE_FIND_LATEST_MESSAGE_PATTERN = 'ordersService.findLatest';
  static ORDERS_SERVICE_TOTAL_SALES_MESSAGE_PATTERN = 'ordersService.totalSales';
  static ORDERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'ordersService.findOneById';

  // messages pattern for [Order Items Service].
  static ORDER_ITEMS_SERVICE_FIND_CUSTOM_ORDER_ITEMS_TOTAL_SALES_AND_QUANTITIES_MESSAGE_PATTERN = 'orderItemsService.findCustomOrderItemsTotalSalesAndQuantities';
}
