import { FindOneByIdPayloadDto, Reason } from '@app/common';

export interface IReasonsService {
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>): Promise<Reason | null>;
}
