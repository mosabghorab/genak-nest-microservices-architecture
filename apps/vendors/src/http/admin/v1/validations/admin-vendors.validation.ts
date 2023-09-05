import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
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
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConstants,
  LocationsMicroserviceImpl,
  Vendor,
} from '@app/common';
import { AdminVendorsService } from '../services/admin-vendors.service';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class AdminVendorsValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;
  private readonly documentsMicroserviceImpl: DocumentsMicroserviceImpl;

  constructor(
    @Inject(forwardRef(() => AdminVendorsService))
    private readonly adminVendorsService: AdminVendorsService,
    @Inject(LocationsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(DocumentsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly documentsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.documentsMicroserviceImpl = new DocumentsMicroserviceImpl(documentsMicroservice, Constants.DOCUMENTS_MICROSERVICE_VERSION);
  }

  // validate creation.
  async validateCreation(createVendorDto: CreateVendorDto): Promise<Location> {
    const vendor: Vendor = await this.adminVendorsService.findOneByPhone(createVendorDto.phone);
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: createVendorDto.governorateId,
      failureMessage: 'Governorate not found.',
    });
    for (const regionId of createVendorDto.regionsIds) {
      const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: regionId,
        failureMessage: 'Region not found.',
      });
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return governorate;
  }

  // validate creation upload documents.
  async validateCreationUploadDocuments(
    createVendorDto: CreateVendorDto,
    files?: Express.Multer.File[],
  ): Promise<{
    avatar?: Express.Multer.File;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    const avatar: Express.Multer.File = files.find((file: Express.Multer.File): boolean => file.fieldname === 'avatar');
    if (avatar) {
      if (!new RegExp(CommonConstants.IMAGE_MIMETYPE_REGX).test(avatar.mimetype)) {
        throw new BadRequestException(`avatar must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
      }
      files = files.filter((file: Express.Multer.File): boolean => file.fieldname !== 'avatar');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const documents: Document[] = await this.documentsMicroserviceImpl.findAll(<FindAllDocumentsDto>{
      serviceType: createVendorDto.serviceType,
      active: true,
    });
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = files.findIndex((file: Express.Multer.File): boolean => file.fieldname === document.id.toString());
      if (fileIndex === -1) {
        if (document.required) throw new BadRequestException(`${document.name} is required.`);
        continue;
      }
      const file: Express.Multer.File = files[fileIndex];
      if (document.type === DocumentType.IMAGE) {
        if (new RegExp(CommonConstants.IMAGE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: 0,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
        }
      } else {
        if (new RegExp(CommonConstants.FILE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: 0,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentDtoList, avatar };
  }

  // validate update.
  async validateUpdate(vendorId: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor: Vendor = await this.adminVendorsService.findOneOrFailById(vendorId, null, {
      attachments: true,
      locationsVendors: true,
    });
    if (updateVendorDto.phone) {
      const vendor: Vendor = await this.adminVendorsService.findOneByPhone(updateVendorDto.phone);
      if (vendor) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateVendorDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: updateVendorDto.governorateId,
        failureMessage: 'Governorate not found.',
      });
      for (const regionId of updateVendorDto.regionsIds) {
        const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
          id: regionId,
          failureMessage: 'Region not found.',
        });
        if (region.parentId !== governorate.id) {
          throw new BadRequestException('The provided region is not a child for the provided governorate.');
        }
      }
    }
    return vendor;
  }

  // validate update upload documents.
  async validateUpdateUploadDocuments(
    vendor: Vendor,
    files?: Express.Multer.File[],
  ): Promise<{
    avatar?: Express.Multer.File;
    createAttachmentDtoList: CreateAttachmentDto[];
  }> {
    const avatar: Express.Multer.File = files.find((file: Express.Multer.File): boolean => file.fieldname === 'avatar');
    if (avatar) {
      if (!new RegExp(CommonConstants.IMAGE_MIMETYPE_REGX).test(avatar.mimetype)) {
        throw new BadRequestException(`avatar must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
      }
      files = files.filter((file: Express.Multer.File): boolean => file.fieldname !== 'avatar');
    }
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload the required documents.');
    }
    const documents: Document[] = await this.documentsMicroserviceImpl.findAll(<FindAllDocumentsDto>{
      serviceType: vendor.serviceType,
      active: true,
    });
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentDtoList: CreateAttachmentDto[] = [];
    for (let i = 0; i < documents.length; i++) {
      const document: Document = documents[i];
      const fileIndex: number = files.findIndex((file: Express.Multer.File): boolean => file.fieldname === document.id.toString());
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
            vendorId: vendor.id,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an image of [${CommonConstants.IMAGE_MIMETYPE_REGX}].`);
        }
      } else {
        if (new RegExp(CommonConstants.FILE_MIMETYPE_REGX).test(file.mimetype)) {
          createAttachmentDtoList.push(<CreateAttachmentDto>{
            documentId: document.id,
            vendorId: vendor.id,
            file: file,
          });
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentDtoList, avatar };
  }
}
