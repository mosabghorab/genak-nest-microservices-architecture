import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
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
} from '@app/common';
import { AdminVendorsService } from '../services/admin-vendors.service';
import { CreateVendorRequestDto } from '../dtos/create-vendor-request.dto';
import { UpdateVendorRequestDto } from '../dtos/update-vendor-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class AdminVendorsValidation {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;
  private readonly documentsMicroserviceConnection: DocumentsMicroserviceConnection;

  constructor(
    @Inject(forwardRef(() => AdminVendorsService))
    private readonly adminVendorsService: AdminVendorsService,
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(DocumentsMicroserviceConstants.NAME)
    private readonly documentsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.documentsMicroserviceConnection = new DocumentsMicroserviceConnection(documentsMicroservice, Constants.DOCUMENTS_MICROSERVICE_VERSION);
  }

  // validate creation.
  async validateCreation(createVendorRequestDto: CreateVendorRequestDto): Promise<Location> {
    const vendor: Vendor = await this.adminVendorsService.findOneByPhone(
      new FindOneByPhonePayloadDto<Vendor>({
        phone: createVendorRequestDto.phone,
      }),
    );
    if (vendor) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: createVendorRequestDto.governorateId,
        failureMessage: 'Governorate not found.',
      }),
    );
    for (const regionId of createVendorRequestDto.regionsIds) {
      const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: regionId,
          failureMessage: 'Region not found.',
        }),
      );
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return governorate;
  }

  // validate creation upload documents.
  async validateCreationUploadDocuments(
    createVendorRequestDto: CreateVendorRequestDto,
    files?: Express.Multer.File[],
  ): Promise<{
    avatar?: Express.Multer.File;
    createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
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
    const documents: Document[] = await this.documentsMicroserviceConnection.documentsServiceImpl.findAll(
      new FindAllDocumentsPayloadDto({
        serviceType: createVendorRequestDto.serviceType,
        active: true,
      }),
    );
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[] = [];
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
          createAttachmentPayloadDtoList.push(
            new CreateAttachmentPayloadDto({
              documentId: document.id,
              vendorId: 0,
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
              vendorId: 0,
              file: file,
            }),
          );
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentPayloadDtoList, avatar };
  }

  // validate update.
  async validateUpdate(vendorId: number, updateVendorRequestDto: UpdateVendorRequestDto): Promise<Vendor> {
    const vendor: Vendor = await this.adminVendorsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
        relations: {
          attachments: true,
          locationsVendors: true,
        },
      }),
    );
    if (updateVendorRequestDto.phone) {
      const vendor: Vendor = await this.adminVendorsService.findOneByPhone(
        new FindOneByPhonePayloadDto<Vendor>({
          phone: updateVendorRequestDto.phone,
        }),
      );
      if (vendor) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateVendorRequestDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: updateVendorRequestDto.governorateId,
          failureMessage: 'Governorate not found.',
        }),
      );
      for (const regionId of updateVendorRequestDto.regionsIds) {
        const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
          new FindOneOrFailByIdPayloadDto<Location>({
            id: regionId,
            failureMessage: 'Region not found.',
          }),
        );
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
    createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
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
    const documents: Document[] = await this.documentsMicroserviceConnection.documentsServiceImpl.findAll(
      new FindAllDocumentsPayloadDto({
        serviceType: vendor.serviceType,
        active: true,
      }),
    );
    if (!documents || documents.length === 0) {
      throw new BadRequestException('There are no documents to upload.');
    }
    const createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[] = [];
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
          createAttachmentPayloadDtoList.push(
            new CreateAttachmentPayloadDto({
              documentId: document.id,
              vendorId: vendor.id,
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
              vendorId: vendor.id,
              file: file,
            }),
          );
        } else {
          throw new BadRequestException(`${document.name} must be an file of [${CommonConstants.FILE_MIMETYPE_REGX}].`);
        }
      }
    }
    return { createAttachmentPayloadDtoList, avatar };
  }
}
