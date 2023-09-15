import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Attachment,
  AttachmentStatus,
  CommonConstants,
  CreateAttachmentPayloadDto,
  Document,
  DocumentsMicroserviceConnection,
  DocumentsMicroserviceConstants,
  DocumentType,
  FindAllDocumentsPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  Location,
  LocationsMicroserviceConnection,
  LocationsMicroserviceConstants,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class VendorAuthValidation {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;
  private readonly documentsMicroserviceConnection: DocumentsMicroserviceConnection;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
    @Inject(DocumentsMicroserviceConstants.NAME)
    private readonly documentsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.documentsMicroserviceConnection = new DocumentsMicroserviceConnection(documentsMicroservice, Constants.DOCUMENTS_MICROSERVICE_VERSION);
  }

  // validate sign up.
  async validateSignUp(signUpDto: SignUpDto): Promise<void> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneByPhone(
      new FindOneByPhonePayloadDto<Vendor>({
        phone: signUpDto.phone,
      }),
    );
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: signUpDto.governorateId,
        failureMessage: 'Governorate not found.',
      }),
    );
  }

  // validate upload documents.
  async validateUploadDocuments(
    vendorId: number,
    files?: Express.Multer.File[],
  ): Promise<{
    vendor: Vendor;
    createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
  }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
        relations: {
          attachments: true,
        },
      }),
    );
    const documents: Document[] = await this.documentsMicroserviceConnection.documentsServiceImpl.findAll(
      new FindAllDocumentsPayloadDto({
        serviceType: vendor.serviceType,
      }),
    );
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[] = [];
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
          createAttachmentPayloadDtoList.push(
            new CreateAttachmentPayloadDto({
              documentId: document.id,
              vendorId: vendorId,
              file: file,
            }),
          );
        } else {
          throw new BadRequestException(`${document.name} must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
        }
      } else {
        if (new RegExp(CommonConstants.FILE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentPayloadDtoList.push(
            new CreateAttachmentPayloadDto({
              documentId: document.id,
              vendorId: vendorId,
              file: file,
            }),
          );
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentPayloadDtoList, vendor };
  }
}
