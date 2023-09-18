import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, DateFilterPayloadDto, FindOneByIdPayloadDto, Product, ProductsMicroserviceConstants, ServiceType, SkipAdminRoles, UserType } from '@app/common';
import { ProductsService } from '../services/products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null> {
    return this.productsService.findOneById(findOneByIdPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithOrdersCount(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto: DateFilterPayloadDto): Promise<Product[]> {
    return this.productsService.findWithOrdersCount(serviceType, dateFilterPayloadDto);
  }

  @AllowFor(UserType.ADMIN)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findWithTotalSales(@Payload('serviceType') serviceType: ServiceType, @Payload('dateFilterPayloadDto') dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Product[]> {
    return this.productsService.findWithTotalSales(serviceType, dateFilterPayloadDto);
  }
}
