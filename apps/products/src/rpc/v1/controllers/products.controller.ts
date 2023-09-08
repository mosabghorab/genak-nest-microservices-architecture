import { Controller } from '@nestjs/common';
import { DateFilterDto, FindOneByIdDto, Product, ProductsMicroserviceConstants, ServiceType } from '@app/common';
import { ProductsService } from '../services/products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Product>): Promise<Product | null> {
    return this.productsService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterDto') dateFilterDto: DateFilterDto): Promise<Product[]> {
    return this.productsService.findWithOrdersCount(serviceType, dateFilterDto);
  }

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithTotalSales(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterDto') dateFilterDto?: DateFilterDto): Promise<Product[]> {
    return this.productsService.findWithTotalSales(serviceType, dateFilterDto);
  }
}
