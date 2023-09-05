import { Document, DocumentsMicroserviceConstants, FindAllDocumentsDto, IDocumentsMicroservice } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class DocumentsMicroserviceImpl implements IDocumentsMicroservice {
  constructor(private readonly documentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return firstValueFrom<Document[]>(
      this.documentsMicroservice.send(
        {
          cmd: `${DocumentsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ALL}/v${this.version}`,
        },
        findAllDocumentsDto,
      ),
    );
  }
}
