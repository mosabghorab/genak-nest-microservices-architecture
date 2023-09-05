import { ClientProxy } from '@nestjs/microservices';
import { IProductsMicroservice } from '@app/common';

export class ProductsMicroserviceImpl implements IProductsMicroservice {
  constructor(private readonly productsMicroservice: ClientProxy, private readonly version: string) {}
}
