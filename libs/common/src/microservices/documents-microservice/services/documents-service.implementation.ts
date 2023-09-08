import { Document, DocumentsMicroserviceConstants, FindAllDocumentsDto, IDocumentsService } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export class DocumentsServiceImpl implements IDocumentsService {
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
