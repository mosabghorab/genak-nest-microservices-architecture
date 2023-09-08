import { Complain, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';

export interface IComplainsService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Complain>): Promise<Complain | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Complain>): Promise<Complain>;
}
