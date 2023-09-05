import { Controller, Get, Query } from '@nestjs/common';
import { FindAllProductsDto } from '../dtos/find-all-products.dto';
import {
  AllowFor,
  Product,
  ProductDto,
  Serialize,
  UserType,
} from '@app/common';
import { CustomerProductsService } from '../services/customer-products.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/products', version: '1' })
export class CustomerProductsController {
  constructor(
    private readonly customerProductsService: CustomerProductsService,
  ) {}

  @Serialize(ProductDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    return this.customerProductsService.findAll(findAllProductsDto);
  }
}
