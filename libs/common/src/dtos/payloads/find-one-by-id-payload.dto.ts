import { FindOptionsRelations } from 'typeorm';

export class FindOneByIdPayloadDto<T> {
  id: number;
  relations?: FindOptionsRelations<T>;

  constructor(data: { id: number; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
