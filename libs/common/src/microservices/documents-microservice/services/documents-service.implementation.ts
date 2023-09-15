import { Document, DocumentsMicroserviceConstants, FindAllDocumentsPayloadDto, IDocumentsService } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export class DocumentsServiceImpl implements IDocumentsService {
  constructor(private readonly documentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]> {
    return firstValueFrom<Document[]>(
      this.documentsMicroservice.send<Document[], { findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto }>(
        {
          cmd: `${DocumentsMicroserviceConstants.DOCUMENTS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findAllDocumentsPayloadDto },
      ),
    );
  }
}
