import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto, IAttachmentsService } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export class AttachmentsServiceImpl implements IAttachmentsService {
  constructor(private readonly attachmentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto): Promise<Attachment[]> {
    return firstValueFrom<Attachment[]>(
      this.attachmentsMicroservice.send<
        Attachment[],
        {
          findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto;
        }
      >(
        {
          cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findAllAttachmentsByVendorIdAndDocumentIdPayloadDto },
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
