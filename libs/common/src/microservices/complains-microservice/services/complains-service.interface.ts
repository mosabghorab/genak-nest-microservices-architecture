import { Complain, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';

export interface IComplainsService {
  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Complain>): Promise<Complain>;
}
