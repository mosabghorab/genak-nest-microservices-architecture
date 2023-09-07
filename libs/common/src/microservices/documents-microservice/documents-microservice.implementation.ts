import { Document, DocumentsMicroserviceConstants, FindAllDocumentsDto, IDocumentsMicroservice } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class DocumentsMicroserviceImpl implements IDocumentsMicroservice {
  constructor(private readonly documentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return firstValueFrom<Document[]>(
      this.documentsMicroservice.send<Document[], FindAllDocumentsDto>(
        {
          cmd: `${DocumentsMicroserviceConstants.DOCUMENTS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        findAllDocumentsDto,
      ),
    );
  }
}
