import { Controller } from '@nestjs/common';
import { AttachmentsService } from '../services/attachments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdDto } from '@app/common';

const VERSION = '1';

@Controller()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID}/v${VERSION}`,
  })
  findAllByVendorIdAndDocumentId(
    @Payload()
    findAllAttachmentsByVendorIdAndDocumentIdDto: FindAllAttachmentsByVendorIdAndDocumentIdDto,
  ): Promise<Attachment[]> {
    return this.attachmentsService.findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdDto);
  }

  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${VERSION}`,
  })
  removeOneByInstance(
    @Payload()
    attachment: Attachment,
  ): Promise<Attachment> {
    return this.attachmentsService.removeOneByInstance(attachment);
  }
}
