import { CustomerAddress, CustomersMicroserviceConstants, FindOneByIdDto, FindOneOrFailByIdDto, ICustomerAddressesService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomerAddressesServiceImpl implements ICustomerAddressesService {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return firstValueFrom<CustomerAddress>(
      this.customersMicroservice.send<CustomerAddress, FindOneByIdDto<CustomerAddress>>(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(<FindOneByIdDto<CustomerAddress>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!customerAddress) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Customer address not found.');
    }
    return customerAddress;
  }
}
