export abstract class ProductsMicroserviceConstants {
  static NAME = 'products';
  static CONFIG_NAME = 'PRODUCTS';

  // messages pattern for [Products Service].
  static PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN = 'productsService.findOneById';
  static PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN = 'productsService.findWithTotalSales';
  static PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN = 'productsService.findWithOrdersCount';
}
