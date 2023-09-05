import { Document, FindAllDocumentsDto } from '@app/common';

export interface IDocumentsMicroservice {
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]>;
}
