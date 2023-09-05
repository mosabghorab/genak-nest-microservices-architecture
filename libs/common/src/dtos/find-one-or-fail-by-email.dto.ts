import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByEmailDto<T> {
  email: string;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;
}
