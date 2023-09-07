import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Attachment,
  AttachmentStatus,
  CommonConstants,
  CreateAttachmentDto,
  Document,
  DocumentsMicroserviceConstants,
  DocumentsMicroserviceImpl,
  DocumentType,
  FindAllDocumentsDto,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConstants,
  LocationsMicroserviceImpl,
  Vendor,
  VendorSignUpDto,
  VendorsMicroserviceConstants,
  VendorsMicroserviceImpl,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class VendorAuthValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;
  private readonly documentsMicroserviceImpl: DocumentsMicroserviceImpl;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
    @Inject(DocumentsMicroserviceConstants.NAME)
    private readonly documentsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.documentsMicroserviceImpl = new DocumentsMicroserviceImpl(documentsMicroservice, Constants.DOCUMENTS_MICROSERVICE_VERSION);
  }

  // validate sign up.
  async validateSignUp(vendorSignUpDto: VendorSignUpDto): Promise<void> {
    const vendor: Vendor = await this.vendorsMicroserviceImpl.findOneByPhone(<FindOneByPhoneDto<Vendor>>{
      phone: vendorSignUpDto.phone,
    });
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: vendorSignUpDto.governorateId,
      failureMessage: 'Governorate not found.',
    });
  }

  // validate upload documents.
  async validateUploadDocuments(
    vendorId: number,
    files?: Express.Multer.File[],
  ): Promise<{
    vendor: Vendor;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const vendor: Vendor = await this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
      relations: {
        attachments: true,
      },
    });
    const documents: Document[] = await this.documentsMicroserviceImpl.findAll(<FindAllDocumentsDto>{
      serviceType: vendor.serviceType,
    });
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = files.findIndex((file: Express.Multer.File) => file.fieldname === document.id.toString());
      if (fileIndex === -1) {
        const oldAttachmentIndex: number = vendor.attachments.findIndex((attachment: Attachment): boolean => attachment.documentId === document.id);
        if (document.required && (oldAttachmentIndex === -1 || (oldAttachmentIndex !== -1 && vendor.attachments[oldAttachmentIndex].status == AttachmentStatus.REQUIRED_FOR_UPLOAD)))
          throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file: Express.Multer.File = files[fileIndex];
      if (document.type === DocumentType.IMAGE) {
        if (new RegExp(CommonConstants.IMAGE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
        }
      } else {
        if (new RegExp(CommonConstants.FILE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendorId,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentDtoList: createAttachmentDtoList, vendor };
  }
}
