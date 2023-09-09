import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, DeleteFileDto, FindAllAttachmentsByVendorIdAndDocumentIdDto, StorageMicroserviceConnection, StorageMicroserviceConstants } from '@app/common';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AttachmentsService {
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
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
    await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(<DeleteFileDto>{
      prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
      fileUrl: attachment.file,
    });
    return this.attachmentRepository.remove(attachment);
  }
}
