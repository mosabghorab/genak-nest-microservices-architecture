import { FindOneByIdDto, Location } from '@app/common';

export interface ILocationsMicroservice {
  findOneById(findOneByIdDto: FindOneByIdDto<Location>): Promise<Location | null>;
}
