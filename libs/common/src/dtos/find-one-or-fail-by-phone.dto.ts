import { FindOptionsRelations } from 'typeorm';

export class FindOneOrFailByPhoneDto<T> {
  phone: string;
  failureMessage?: string;
  relations?: FindOptionsRelations<T>;
}
