import { Controller } from '@nestjs/common';
import { DateFilterPayloadDto, FindOneByIdPayloadDto, Product, ProductsMicroserviceConstants, ServiceType } from '@app/common';
import { ProductsService } from '../services/products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null> {
    return this.productsService.findOneById(findOneByIdPayloadDto);
  }

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Product[]> {
    return this.productsService.findWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithTotalSales(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Product[]> {
    return this.productsService.findWithTotalSales(serviceType, dateFilterPayloadDto);
  }
}
