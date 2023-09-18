import { AuthGuard, Document, DocumentsMicroserviceConstants, FindAllDocumentsPayloadDto, IDocumentsService, RpcAuthenticationPayloadDto } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
export class DocumentsServiceImpl implements IDocumentsService {
  constructor(private readonly documentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]> {
    return firstValueFrom<Document[]>(
      this.documentsMicroservice.send<
        Document[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto;
        }
      >(
        {
          cmd: `${DocumentsMicroserviceConstants.DOCUMENTS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findAllDocumentsPayloadDto },
      ),
    );
  }
}
