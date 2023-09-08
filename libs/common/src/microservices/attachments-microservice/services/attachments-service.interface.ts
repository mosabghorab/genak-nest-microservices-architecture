import { Attachment, FindAllAttachmentsByVendorIdAndDocumentIdDto } from '@app/common';

export interface IAttachmentsService {
  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdDto: FindAllAttachmentsByVendorIdAndDocumentIdDto): Promise<Attachment[]>;

  // remove one by instance.
  removeOneByInstance(attachment: Attachment): Promise<Attachment>;
}
