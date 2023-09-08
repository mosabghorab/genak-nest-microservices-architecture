import { DocumentsServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class DocumentsMicroserviceConnection {
  public readonly documentsServiceImpl: DocumentsServiceImpl;

  constructor(private readonly documentsMicroservice: ClientProxy, private readonly version: string) {
    this.documentsServiceImpl = new DocumentsServiceImpl(documentsMicroservice, version);
  }
}
