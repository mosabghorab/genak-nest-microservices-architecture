import { Document, FindAllDocumentsPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';

export interface IDocumentsService {
  // find all.
  findAll(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]>;
}
