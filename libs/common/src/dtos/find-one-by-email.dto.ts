import { FindOptionsRelations } from 'typeorm';

export class FindOneByEmailDto<T> {
  email: string;
  relations?: FindOptionsRelations<T>;
}
