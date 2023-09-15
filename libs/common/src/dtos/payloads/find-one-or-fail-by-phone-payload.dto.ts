import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByPhonePayloadDto<T> {
  phone: string;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { phone: string; failureMessage?: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
