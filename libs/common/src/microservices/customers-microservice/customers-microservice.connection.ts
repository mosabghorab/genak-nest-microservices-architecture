import { CustomerAddressesServiceImpl, CustomersServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class CustomersMicroserviceConnection {
  public readonly customersServiceImpl: CustomersServiceImpl;
  public readonly customerAddressesServiceImpl: CustomerAddressesServiceImpl;

  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {
    this.customersServiceImpl = new CustomersServiceImpl(customersMicroservice, version);
    this.customerAddressesServiceImpl = new CustomerAddressesServiceImpl(customersMicroservice, version);
  }
}
