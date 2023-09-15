import { FindOptionsRelations } from 'typeorm';

export class SearchPayloadDto<T> {
  searchQuery: string;
  relations?: FindOptionsRelations<T>;

  constructor(data: { searchQuery: string; relations?: FindOptionsRelations<T> }) {
    Object.assign(this, data);
  }
}
