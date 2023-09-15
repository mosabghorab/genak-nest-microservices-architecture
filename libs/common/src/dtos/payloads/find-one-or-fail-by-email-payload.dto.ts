import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByEmailPayloadDto<T> {
  email: string;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { email: string; failureMessage?: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
