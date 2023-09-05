import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Microservices, Product } from '@app/common';
import { ProductsService } from '../services/products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({
    cmd: `${Microservices.PRODUCTS_MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(
    @Payload() findOneByIdDto: FindOneByIdDto<Product>,
  ): Promise<Product | null> {
    return this.productsService.findOneById(findOneByIdDto);
  }
}
