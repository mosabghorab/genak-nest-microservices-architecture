import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Product, ProductsMicroserviceConstants } from '@app/common';
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
}
