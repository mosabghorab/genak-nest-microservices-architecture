import { FindOneByIdDto, Reason } from '@app/common';

export interface IReasonsService {
  findOneById(findOneByIdDto: FindOneByIdDto<Reason>): Promise<Reason | null>;
}
