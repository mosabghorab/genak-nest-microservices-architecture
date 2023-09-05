import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Attachment,
  AttachmentsMicroserviceConstants,
  AttachmentsMicroserviceImpl,
  FindAllAttachmentsByVendorIdAndDocumentIdDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
  UploadFileDto,
  Vendor,
  VendorSignUpDto,
  VendorUploadDocumentsDto,
} from '@app/common';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VendorsService {
  private readonly attachmentMicroserviceImpl: AttachmentsMicroserviceImpl;
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @Inject(AttachmentsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly attachmentsMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.MICROSERVICE_NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.attachmentMicroserviceImpl = new AttachmentsMicroserviceImpl(attachmentsMicroservice, Constants.ATTACHMENTS_MICROSERVICE_VERSION);
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone: findOneByPhoneDto.phone },
      relations: findOneByPhoneDto.relations,
    });
  }

  // create.
  async create(vendorSignUpDto: VendorSignUpDto, avatar?: Express.Multer.File): Promise<Vendor> {
    let avatarUrl: string;
    if (avatar) {
      avatarUrl = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
        file: avatar,
      });
    }
    return await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatarUrl,
        ...vendorSignUpDto,
      }),
    );
  }

  // upload documents.
  async uploadDocuments(vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(<FindOneByIdDto<Vendor>>{
      id: vendorUploadDocumentsDto.vendorId,
      relations: {
        attachments: true,
      },
    });
    const attachments: Attachment[] = [];
    for (const createAttachmentDto of vendorUploadDocumentsDto.createAttachmentDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentMicroserviceImpl.findAllByVendorIdAndDocumentId(<FindAllAttachmentsByVendorIdAndDocumentIdDto>{
        vendorId: vendorUploadDocumentsDto.vendorId,
        documentId: createAttachmentDto.documentId,
      });
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentMicroserviceImpl.removeOneByInstance(oldAttachment);
          vendor.attachments = vendor.attachments.filter((e: Attachment) => e.id !== oldAttachment.id);
        }
      }
      const fileUrl: string = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
        file: createAttachmentDto.file,
      });
      attachments.push(<Attachment>{
        documentId: createAttachmentDto.documentId,
        vendorId: createAttachmentDto.vendorId,
        file: fileUrl,
      });
    }
    vendor.attachments = [...vendor.attachments, ...attachments];
    return await this.vendorRepository.save(vendor);
  }

  // update.
  // async update(
  //   customerId: number,
  //   updateCustomerDto: UpdateCustomerDto,
  // ): Promise<Customer> {
  //   const customer: Customer =
  //     await this.customerCustomersValidation.validateUpdate(
  //       customerId,
  //       updateCustomerDto,
  //     );
  //   Object.assign(customer, updateCustomerDto);
  //   return this.customerRepository.save(customer);
  // }

  // remove one by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor> {
    return this.vendorRepository.remove(vendor);
  }
}
