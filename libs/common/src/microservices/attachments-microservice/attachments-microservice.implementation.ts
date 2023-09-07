import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdDto, IAttachmentsMicroservice } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class AttachmentsMicroserviceImpl implements IAttachmentsMicroservice {
  constructor(private readonly attachmentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdDto: FindAllAttachmentsByVendorIdAndDocumentIdDto): Promise<Attachment[]> {
    return firstValueFrom<Attachment[]>(
      this.attachmentsMicroservice.send<Attachment[], FindAllAttachmentsByVendorIdAndDocumentIdDto>(
        {
          cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findAllAttachmentsByVendorIdAndDocumentIdDto,
      ),
    );
  }

  // remove one by instance.
  removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    return firstValueFrom<Attachment>(
      this.attachmentsMicroservice.send<Attachment, Attachment>(
        {
          cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        attachment,
      ),
    );
  }
}
