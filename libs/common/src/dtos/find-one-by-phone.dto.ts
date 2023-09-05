import { FindOptionsRelations } from 'typeorm';

export class FindOneByPhoneDto<T> {
  phone: string;
  relations?: FindOptionsRelations<T>;
}
