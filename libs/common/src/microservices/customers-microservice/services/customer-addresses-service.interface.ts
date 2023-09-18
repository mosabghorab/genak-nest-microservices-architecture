import { CustomerAddress, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';

export interface ICustomerAddressesService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null>;
}
