import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByIdDto<T> {
  id: number;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;
}
