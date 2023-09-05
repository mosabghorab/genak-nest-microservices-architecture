import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdDto, IAttachmentsMicroservice } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class AttachmentsMicroserviceImpl implements IAttachmentsMicroservice {
  constructor(private readonly attachmentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdDto: FindAllAttachmentsByVendorIdAndDocumentIdDto): Promise<Attachment[]> {
    return firstValueFrom<Attachment[]>(
      this.attachmentsMicroservice.send(
        {
          cmd: `${AttachmentsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID}/v${this.version}`,
        },
        findAllAttachmentsByVendorIdAndDocumentIdDto,
      ),
    );
  }

  // remove one by instance.
  removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    return firstValueFrom<Attachment>(
      this.attachmentsMicroservice.send(
        {
          cmd: `${AttachmentsMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${this.version}`,
        },
        attachment,
      ),
    );
  }
}
