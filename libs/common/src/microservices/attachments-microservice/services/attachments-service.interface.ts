import { Attachment, FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';

export interface IAttachmentsService {
  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  ): Promise<Attachment[]>;

  // remove one by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, attachment: Attachment): Promise<Attachment>;
}
