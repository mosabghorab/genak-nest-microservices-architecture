import { Attachment, FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto } from '@app/common';

export interface IAttachmentsService {
  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto): Promise<Attachment[]>;

  // remove one by instance.
  removeOneByInstance(attachment: Attachment): Promise<Attachment>;
}
