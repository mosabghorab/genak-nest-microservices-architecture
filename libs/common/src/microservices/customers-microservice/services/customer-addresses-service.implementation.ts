import { CustomerAddress, CustomersMicroserviceConstants, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, ICustomerAddressesService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomerAddressesServiceImpl implements ICustomerAddressesService {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return firstValueFrom<CustomerAddress>(
      this.customersMicroservice.send<
        CustomerAddress,
        {
          findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(
      new FindOneByIdPayloadDto<CustomerAddress>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!customerAddress) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Customer address not found.');
    }
    return customerAddress;
  }
}
