import { DateFilterPayloadDto, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, IProductsService, Product, ProductsMicroserviceConstants, ServiceType } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ProductsServiceImpl implements IProductsService {
  constructor(private readonly productsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Product>): Promise<Product | null> {
    return firstValueFrom<Product>(
      this.productsMicroservice.send<Product, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Product> }>(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Product>): Promise<Product> {
    const product: Product = await this.findOneById(
      new FindOneByIdPayloadDto<Product>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!product) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Product not found.');
    }
    return product;
  }

  // find with orders count.
  findWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Product[]> {
    return firstValueFrom<Product[]>(
      this.productsMicroservice.send<
        Product[],
        {
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }

  // find with total sales.
  findWithTotalSales(serviceType: ServiceType, dateFilterPayloadDto?: DateFilterPayloadDto): Promise<Product[]> {
    return firstValueFrom<Product[]>(
      this.productsMicroservice.send<
        Product[],
        {
          serviceType: ServiceType;
          dateFilterPayloadDto?: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${ProductsMicroserviceConstants.PRODUCTS_SERVICE_FIND_WITH_TOTAL_SALES_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }
}
