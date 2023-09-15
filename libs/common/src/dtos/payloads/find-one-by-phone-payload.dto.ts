import { FindOptionsRelations } from 'typeorm';

export class FindOneByPhonePayloadDto<T> {
  phone: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { phone: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
