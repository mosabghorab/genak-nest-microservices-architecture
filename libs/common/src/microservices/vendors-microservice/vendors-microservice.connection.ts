import { VendorsServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class VendorsMicroserviceConnection {
  public readonly vendorsServiceImpl: VendorsServiceImpl;

  constructor(private readonly vendorsMicroservice: ClientProxy, private readonly version: string) {
    this.vendorsServiceImpl = new VendorsServiceImpl(vendorsMicroservice, version);
  }
}
