import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, DeleteFileDto, FindOneByIdDto, FindOneOrFailByIdDto, StorageMicroserviceConnection, StorageMicroserviceConstants } from '@app/common';
import { UpdateAttachmentStatusDto } from '../dtos/update-attachment-status.dto';
import { Constants } from '../../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminAttachmentsService {
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Attachment>): Promise<Attachment | null> {
    return this.attachmentRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Attachment>): Promise<Attachment> {
    const attachment: Attachment = await this.findOneById(<FindOneByIdDto<Attachment>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!attachment) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Attachment not found.');
    }
    return attachment;
  }

  // find all by vendor id and document id.
  findAllByVendorIdAndDocumentId(vendorId: number, documentId: number): Promise<Attachment[]> {
    return this.attachmentRepository.find({
      where: { vendorId, documentId },
    });
  }

  // update status.
  async updateStatus(id: number, updateAttachmentStatusDto: UpdateAttachmentStatusDto): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(<FindOneOrFailByIdDto<Attachment>>{
      id,
    });
    attachment.status = updateAttachmentStatusDto.status;
    return this.attachmentRepository.save(attachment);
  }

  // remove one by id.
  async removeOneById(id: number): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(<FindOneOrFailByIdDto<Attachment>>{
      id,
    });
    return this.removeOneByInstance(attachment);
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
