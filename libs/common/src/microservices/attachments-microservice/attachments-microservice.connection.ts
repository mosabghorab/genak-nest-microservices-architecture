import { AttachmentsServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class AttachmentsMicroserviceConnection {
  public readonly attachmentsServiceImpl: AttachmentsServiceImpl;

  constructor(private readonly attachmentsMicroservice: ClientProxy, private readonly version: string) {
    this.attachmentsServiceImpl = new AttachmentsServiceImpl(attachmentsMicroservice, version);
  }
}
