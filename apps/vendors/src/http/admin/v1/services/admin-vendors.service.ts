import { forwardRef, Inject, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  Attachment,
  AttachmentsMicroserviceConnection,
  AttachmentsMicroserviceConstants,
  CreateAttachmentDto,
  DateFilterOption,
  DateHelpers,
  DeleteFileDto,
  FindAllAttachmentsByVendorIdAndDocumentIdDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  FindOneOrFailByPhoneDto,
  Location,
  LocationVendor,
  StorageMicroserviceConnection,
  StorageMicroserviceConstants,
  UploadFileDto,
  Vendor,
  VendorStatus,
} from '@app/common';
import { AdminVendorsValidation } from '../validations/admin-vendors.validation';
import { ClientProxy } from '@nestjs/microservices';
import { LocationsVendorsService } from '../../../shared/v1/services/locations-vendors.service';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { Constants } from '../../../../constants';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
import { Workbook, Worksheet } from 'exceljs';
import * as fsExtra from 'fs-extra';
import { createReadStream } from 'fs';

@Injectable()
export class AdminVendorsService {
  private readonly attachmentsMicroserviceConnection: AttachmentsMicroserviceConnection;
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsVendorsService: LocationsVendorsService,
    @Inject(forwardRef(() => AdminVendorsValidation))
    private readonly adminVendorsValidation: AdminVendorsValidation,
    @Inject(AttachmentsMicroserviceConstants.NAME)
    private readonly attachmentsMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.attachmentsMicroserviceConnection = new AttachmentsMicroserviceConnection(attachmentsMicroservice, Constants.ATTACHMENTS_MICROSERVICE_VERSION);
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { id: findOneByIdDto.id }, relations: findOneByIdDto.relations });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(<FindOneByIdDto<Vendor>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone: findOneByPhoneDto.phone },
      relations: findOneByPhoneDto.relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneByPhone(<FindOneByPhoneDto<Vendor>>{
      phone: findOneOrFailByPhoneDto.phone,
      relations: findOneOrFailByPhoneDto.relations,
    });
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByPhoneDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find all.
  async findAll(findAllVendorsDto: FindAllVendorsDto): Promise<
    | { total: number; perPage: number; lastPage: number; data: Vendor[]; currentPage: number }
    | {
        total: number;
        data: Vendor[];
      }
  > {
    const offset: number = (findAllVendorsDto.page - 1) * findAllVendorsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllVendorsDto.dateFilterOption) {
      if (findAllVendorsDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllVendorsDto.startDate,
          endDate: findAllVendorsDto.endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllVendorsDto.dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<Vendor> = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoin('vendor.orders', 'order')
      .addSelect('COUNT(order.id)', ' ordersCount');
    if (findAllVendorsDto.regionsIds) {
      queryBuilder.innerJoin('vendor.locationsVendors', 'locationVendor', 'locationVendor.locationId IN (:...regionsIds)', { regionsIds: findAllVendorsDto.regionsIds });
    }
    queryBuilder
      .where('vendor.serviceType = :serviceType', {
        serviceType: findAllVendorsDto.serviceType,
      })
      .andWhere('vendor.status IN (:...statuses)', {
        statuses: findAllVendorsDto.statuses,
      });
    if (findAllVendorsDto.governorateId) {
      queryBuilder.andWhere('vendor.governorateId = :governorateId', {
        governorateId: findAllVendorsDto.governorateId,
      });
    }
    if (findAllVendorsDto.dateFilterOption) {
      queryBuilder.andWhere('vendor.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    queryBuilder.groupBy('vendor.id').orderBy('ordersCount', findAllVendorsDto.orderByType);
    if (findAllVendorsDto.paginationEnable) queryBuilder.skip(offset).take(findAllVendorsDto.limit);
    const { entities, raw }: { entities: Vendor[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i].locationsVendors = await this.locationsVendorsService.findAllByVendorId(entities[i].id, {
        location: true,
      });
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return findAllVendorsDto.paginationEnable
      ? {
          perPage: findAllVendorsDto.limit,
          currentPage: findAllVendorsDto.page,
          lastPage: Math.ceil(count / findAllVendorsDto.limit),
          total: count,
          data: entities,
        }
      : { total: count, data: entities };
  }

  // create.
  async create(createVendorDto: CreateVendorDto, files?: Express.Multer.File[]): Promise<Vendor> {
    const governorate: Location = await this.adminVendorsValidation.validateCreation(createVendorDto);
    const {
      createAttachmentDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentDtoList: CreateAttachmentDto[];
    } = await this.adminVendorsValidation.validateCreationUploadDocuments(createVendorDto, files);
    let avatarUrl: string;
    if (avatar) {
      avatarUrl = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
        file: avatar,
      });
    }
    const savedVendor: Vendor = await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatarUrl,
        status: VendorStatus.PENDING,
        ...createVendorDto,
      }),
    );
    const locationsVendors: LocationVendor[] = createVendorDto.regionsIds.map(
      (value: number) =>
        <LocationVendor>{
          vendorId: savedVendor.id,
          locationId: value,
        },
    );
    createAttachmentDtoList.forEach((value: CreateAttachmentDto) => {
      value.vendorId = savedVendor.id;
    });
    const attachments: Attachment[] = [];
    for (const createAttachmentDto of createAttachmentDtoList) {
      const fileUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
        file: createAttachmentDto.file,
      });
      attachments.push(<Attachment>{
        documentId: createAttachmentDto.documentId,
        vendorId: createAttachmentDto.vendorId,
        file: fileUrl,
      });
    }
    savedVendor.locationsVendors = locationsVendors;
    savedVendor.attachments = attachments;
    savedVendor.governorate = governorate;
    return await this.vendorRepository.save(savedVendor);
  }

  // update.
  async update(vendorId: number, updateVendorDto: UpdateVendorDto, files?: Express.Multer.File[]): Promise<Vendor> {
    const vendor: Vendor = await this.adminVendorsValidation.validateUpdate(vendorId, updateVendorDto);
    const {
      createAttachmentDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentDtoList: CreateAttachmentDto[];
    } = await this.adminVendorsValidation.validateUpdateUploadDocuments(vendor, files);
    if (avatar) {
      if (vendor.avatar)
        await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(<DeleteFileDto>{
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          fileUrl: vendor.avatar,
        });
      vendor.avatar = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
        file: avatar,
      });
    }
    Object.assign(vendor, updateVendorDto);
    const savedVendor: Vendor = await this.vendorRepository.save(vendor);
    if (updateVendorDto.regionsIds) {
      for (const locationVendor of savedVendor.locationsVendors) {
        await this.locationsVendorsService.removeOneByInstance(locationVendor);
      }
      // prepare regions.
      savedVendor.locationsVendors = updateVendorDto.regionsIds.map(
        (value: number) =>
          <LocationVendor>{
            vendorId: savedVendor.id,
            locationId: value,
          },
      );
    }
    const attachments: Attachment[] = [];
    for (const createAttachmentDto of createAttachmentDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.findAllByVendorIdAndDocumentId(<FindAllAttachmentsByVendorIdAndDocumentIdDto>{
        vendorId: savedVendor.id,
        documentId: createAttachmentDto.documentId,
      });
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.removeOneByInstance(oldAttachment);
          savedVendor.attachments = savedVendor.attachments.filter((attachment: Attachment): boolean => attachment.id !== oldAttachment.id);
        }
      }
      const fileUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
        file: avatar,
      });
      attachments.push(<Attachment>{
        documentId: createAttachmentDto.documentId,
        vendorId: createAttachmentDto.vendorId,
        file: fileUrl,
      });
    }
    savedVendor.attachments = [...savedVendor.attachments, ...attachments];
    return this.vendorRepository.save(savedVendor);
  }

  // remove.
  async remove(id: number): Promise<Vendor> {
    const vendor: Vendor = await this.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id,
    });
    return this.vendorRepository.remove(vendor);
  }

  // export all.
  async exportAll(findAllVendorsDto: FindAllVendorsDto): Promise<StreamableFile> {
    const { data }: { data: Vendor[] } = await this.findAll(findAllVendorsDto);
    const workbook: Workbook = new Workbook();
    const worksheet: Worksheet = workbook.addWorksheet('الموزعين');
    // add headers.
    worksheet.addRow(['رقم الموزع', 'إسم الموزع', 'إسم التجاري', 'المدينة', 'الأحياء', 'رقم الجوال', 'عدد الطلبات', 'تاريخ الانشاء']);
    // add data rows.
    data.forEach((vendor: Vendor): void => {
      worksheet.addRow([
        vendor.id,
        vendor.name,
        vendor.commercialName,
        vendor.governorate.name,
        vendor.locationsVendors.map((locationVendor: LocationVendor): string => locationVendor.location.name).join(' ، '),
        vendor.phone,
        vendor['ordersCount'],
        vendor.createdAt.toDateString(),
      ]);
    });
    const dirPath = './exports/';
    const filePath = `${dirPath}exported-file.xlsx`;
    await fsExtra.ensureDir(dirPath);
    await workbook.xlsx.writeFile(filePath);
    return new StreamableFile(createReadStream(filePath));
  }
}
