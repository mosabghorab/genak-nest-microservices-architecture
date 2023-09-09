import { ClientProxy } from '@nestjs/microservices';
import { ProductsServiceImpl } from '@app/common';

export class ProductsMicroserviceConnection {
  public readonly productsServiceImpl: ProductsServiceImpl;

  constructor(private readonly productsMicroservice: ClientProxy, private readonly version: string) {
    this.productsServiceImpl = new ProductsServiceImpl(productsMicroservice, version);
  }
}
