import { CustomerAddress, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';

export interface ICustomerAddressesService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<CustomerAddress>): Promise<CustomerAddress | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<CustomerAddress>): Promise<CustomerAddress | null>;
}
