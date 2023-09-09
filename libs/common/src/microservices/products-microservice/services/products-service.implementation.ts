import { DateFilterDto, FindOneByIdDto, FindOneOrFailByIdDto, IProductsService, Product, ProductsMicroserviceConstants, ServiceType } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ProductsServiceImpl implements IProductsService {
  constructor(private readonly productsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Product>): Promise<Product | null> {
    return firstValueFrom<Product>(
      this.productsMicroservice.send<Product, FindOneByIdDto<Product>>(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Product>): Promise<Product> {
    const product: Product = await this.findOneById(<FindOneByIdDto<Product>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!product) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Product not found.');
    }
    return product;
  }

  // find with orders count.
  findWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Product[]> {
    return firstValueFrom<Product[]>(
      this.productsMicroservice.send<Product[], { serviceType: ServiceType; dateFilterDto: DateFilterDto }>(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
        },
      ),
    );
  }

  // find with total sales.
  findWithTotalSales(serviceType: ServiceType, dateFilterDto?: DateFilterDto): Promise<Product[]> {
    return firstValueFrom<Product[]>(
      this.productsMicroservice.send<Product[], { serviceType: ServiceType; dateFilterDto?: DateFilterDto }>(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
        },
      ),
    );
  }
}
