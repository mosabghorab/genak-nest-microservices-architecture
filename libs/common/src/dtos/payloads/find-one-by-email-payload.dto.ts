import { FindOptionsRelations } from 'typeorm';

export class FindOneByEmailPayloadDto<T> {
  email: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { email: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
