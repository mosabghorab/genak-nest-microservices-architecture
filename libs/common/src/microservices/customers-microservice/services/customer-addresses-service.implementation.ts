import { CustomerAddress, CustomersMicroserviceConstants, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, ICustomerAddressesService, RpcAuthenticationPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomerAddressesServiceImpl implements ICustomerAddressesService {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null> {
    return firstValueFrom<CustomerAddress>(
      this.customersMicroservice.send<
        CustomerAddress,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>;
        }
      >(
        {
          cmd: `${CustomersMicroserviceConstants.CUSTOMER_ADDRESSES_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress> {
    const customerAddress: CustomerAddress = await this.findOneById(
      rpcAuthenticationPayloadDto,
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
