import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment, DeleteFilePayloadDto, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, StorageMicroserviceConnection, StorageMicroserviceConstants } from '@app/common';
import { UpdateAttachmentStatusRequestDto } from '../dtos/update-attachment-status-request.dto';
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Attachment>): Promise<Attachment | null> {
    return this.attachmentRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Attachment>): Promise<Attachment> {
    const attachment: Attachment = await this.findOneById(
      new FindOneByIdPayloadDto<Attachment>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!attachment) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Attachment not found.');
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
  async updateStatus(id: number, updateAttachmentStatusRequestDto: UpdateAttachmentStatusRequestDto): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Attachment>({
        id,
      }),
    );
    attachment.status = updateAttachmentStatusRequestDto.status;
    return this.attachmentRepository.save(attachment);
  }

  // remove one by id.
  async removeOneById(id: number): Promise<Attachment> {
    const attachment: Attachment = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Attachment>({
        id,
      }),
    );
    return this.removeOneByInstance(attachment);
  }

  // remove one by instance.
  async removeOneByInstance(attachment: Attachment): Promise<Attachment> {
    await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(
      new DeleteFilePayloadDto({
        prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
        fileUrl: attachment.file,
      }),
    );
    return this.attachmentRepository.remove(attachment);
  }
}
