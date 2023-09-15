import { Controller, Get, Query } from '@nestjs/common';
import { FindAllProductsRequestDto } from '../dtos/find-all-products-request.dto';
import { AllowFor, Product, ProductResponseDto, Serialize, UserType } from '@app/common';
import { CustomerProductsService } from '../services/customer-products.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/products', version: '1' })
export class CustomerProductsController {
  constructor(private readonly customerProductsService: CustomerProductsService) {}

  @Serialize(ProductResponseDto, 'All products.')
  @Get()
  findAll(@Query() findAllProductsRequestDto: FindAllProductsRequestDto): Promise<Product[]> {
    return this.customerProductsService.findAll(findAllProductsRequestDto);
  }
}
