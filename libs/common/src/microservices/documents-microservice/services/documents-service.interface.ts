import { Document, FindAllDocumentsPayloadDto } from '@app/common';

export interface IDocumentsService {
  // find all.
  findAll(findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]>;
}
