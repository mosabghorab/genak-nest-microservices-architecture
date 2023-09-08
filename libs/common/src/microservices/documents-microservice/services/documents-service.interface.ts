import { Document, FindAllDocumentsDto } from '@app/common';

export interface IDocumentsService {
  // find all.
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]>;
}
