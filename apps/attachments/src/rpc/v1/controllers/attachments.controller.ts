import { Controller, UseGuards } from '@nestjs/common';
import { AttachmentsService } from '../services/attachments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AllowFor,
  Attachment,
  AttachmentsMicroserviceConstants,
  AuthedUser,
  AuthGuard,
  FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  GetAuthedUser,
  SkipAdminRoles,
  UserType,
} from '@app/common';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAllByVendorIdAndDocumentId(
    @Payload('findAllAttachmentsByVendorIdAndDocumentIdPayloadDto')
    findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  ): Promise<Attachment[]> {
    return this.attachmentsService.findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdPayloadDto);
  }

  @AllowFor(UserType.ADMIN, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneByInstance(
    @GetAuthedUser() authedUser: AuthedUser,
    @Payload('attachment')
    attachment: Attachment,
  ): Promise<Attachment> {
    return this.attachmentsService.removeOneByInstance(authedUser, attachment);
  }
}
