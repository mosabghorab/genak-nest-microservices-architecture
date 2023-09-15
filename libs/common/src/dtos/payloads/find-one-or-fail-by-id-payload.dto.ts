import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByIdPayloadDto<T> {
  id: number;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { id: number; failureMessage?: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
