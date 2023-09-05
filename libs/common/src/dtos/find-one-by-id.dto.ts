import { FindOptionsRelations } from 'typeorm';

export class FindOneByIdDto<T> {
  id: number;
  relations?: FindOptionsRelations<T>;
}
