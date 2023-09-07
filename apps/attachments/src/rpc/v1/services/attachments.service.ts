import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, DeleteFileDto, FindAllAttachmentsByVendorIdAndDocumentIdDto, StorageMicroserviceConstants, StorageMicroserviceImpl } from '@app/common';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AttachmentsService {
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(findAllAttachmentsByVendorIdAndDocumentIdDto: FindAllAttachmentsByVendorIdAndDocumentIdDto): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: {
        vendorId: findAllAttachmentsByVendorIdAndDocumentIdDto.vendorId,
        documentId: findAllAttachmentsByVendorIdAndDocumentIdDto.documentId,
      },
    });
  }

  // remove one by instance.
  async removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    await this.storageMicroserviceImpl.deleteFile(<DeleteFileDto>{
      prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
      fileUrl: attachment.file,
    });
    return this.attachmentRepository.remove(attachment);
  }
}
