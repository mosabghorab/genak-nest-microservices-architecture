import { CustomerAddress, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';

export interface ICustomerAddressesService {
  findOneById(findOneByIdDto: FindOneByIdDto<CustomerAddress>): Promise<CustomerAddress | null>;

  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<CustomerAddress>): Promise<CustomerAddress | null>;
}
