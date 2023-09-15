import { Controller } from '@nestjs/common';
import { AttachmentsService } from '../services/attachments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto } from '@app/common';

const VERSION = '1';

@Controller()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAllByVendorIdAndDocumentId(
    @Payload('findAllAttachmentsByVendorIdAndDocumentIdPayloadDto')
    findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  ): Promise<Attachment[]> {
    return this.attachmentsService.findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdPayloadDto);
  }

  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneByInstance(
    @Payload()
    attachment: Attachment,
  ): Promise<Attachment> {
    return this.attachmentsService.removeOneByInstance(attachment);
  }
}
