import { Attachment, AttachmentsMicroserviceConstants, FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto, IAttachmentsService, RpcAuthenticationPayloadDto } from '@app/common';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export class AttachmentsServiceImpl implements IAttachmentsService {
  constructor(private readonly attachmentsMicroservice: ClientProxy, private readonly version: string) {}

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(
    rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto,
    findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  ): Promise<Attachment[]> {
    return firstValueFrom<Attachment[]>(
      this.attachmentsMicroservice.send<
        Attachment[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findAllAttachmentsByVendorIdAndDocumentIdPayloadDto: FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto;
        }
      >(
        {
          cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_FIND_ALL_BY_DOCUMENT_ID_AND_VENDOR_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findAllAttachmentsByVendorIdAndDocumentIdPayloadDto },
      ),
    );
  }

  // remove one by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, attachment: Attachment): Promise<Attachment> {
    return firstValueFrom<Attachment>(
      this.attachmentsMicroservice.send<
        Attachment,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          attachment: Attachment;
        }
      >(
        {
          cmd: `${AttachmentsMicroserviceConstants.ATTACHMENTS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, attachment },
      ),
    );
  }
}
