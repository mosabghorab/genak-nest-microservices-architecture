import { CustomerAddress, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';

export interface ICustomerAddressesService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<CustomerAddress>): Promise<CustomerAddress | null>;
}
