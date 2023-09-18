import { forwardRef, Inject, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  Attachment,
  AttachmentsMicroserviceConnection,
  AttachmentsMicroserviceConstants,
  AuthedUser,
  CreateAttachmentPayloadDto,
  DateFilterOption,
  DateHelpers,
  DeleteFilePayloadDto,
  FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  Location,
  LocationVendor,
  RpcAuthenticationPayloadDto,
  StorageMicroserviceConnection,
  StorageMicroserviceConstants,
  UploadFilePayloadDto,
  Vendor,
  VendorStatus,
} from '@app/common';
import { AdminVendorsValidation } from '../validations/admin-vendors.validation';
import { ClientProxy } from '@nestjs/microservices';
import { LocationsVendorsService } from '../../../shared/v1/services/locations-vendors.service';
import { FindAllVendorsRequestDto } from '../dtos/find-all-vendors-request.dto';
import { CreateVendorRequestDto } from '../dtos/create-vendor-request.dto';
import { Constants } from '../../../../constants';
import { UpdateVendorRequestDto } from '../dtos/update-vendor-request.dto';
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(
      new FindOneByIdPayloadDto<Vendor>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone: findOneByPhonePayloadDto.phone },
      relations: findOneByPhonePayloadDto.relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneByPhone(
      new FindOneByPhonePayloadDto<Vendor>({
        phone: findOneOrFailByPhonePayloadDto.phone,
        relations: findOneOrFailByPhonePayloadDto.relations,
      }),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByPhonePayloadDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find all.
  async findAll(findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<
    | { total: number; perPage: number; lastPage: number; data: Vendor[]; currentPage: number }
    | {
        total: number;
        data: Vendor[];
      }
  > {
    const offset: number = (findAllVendorsRequestDto.page - 1) * findAllVendorsRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllVendorsRequestDto.dateFilterOption) {
      if (findAllVendorsRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
        dateRange = {
          startDate: findAllVendorsRequestDto.startDate,
          endDate: findAllVendorsRequestDto.endDate,
        };
      } else {
        dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllVendorsRequestDto.dateFilterOption);
      }
    }
    const queryBuilder: SelectQueryBuilder<Vendor> = this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.governorate', 'governorate')
      .leftJoin('vendor.orders', 'order')
      .addSelect('COUNT(order.id)', ' ordersCount');
    if (findAllVendorsRequestDto.regionsIds) {
      queryBuilder.innerJoin('vendor.locationsVendors', 'locationVendor', 'locationVendor.locationId IN (:...regionsIds)', { regionsIds: findAllVendorsRequestDto.regionsIds });
    }
    queryBuilder
      .where('vendor.serviceType = :serviceType', {
        serviceType: findAllVendorsRequestDto.serviceType,
      })
      .andWhere('vendor.status IN (:...statuses)', {
        statuses: findAllVendorsRequestDto.statuses,
      });
    if (findAllVendorsRequestDto.governorateId) {
      queryBuilder.andWhere('vendor.governorateId = :governorateId', {
        governorateId: findAllVendorsRequestDto.governorateId,
      });
    }
    if (findAllVendorsRequestDto.dateFilterOption) {
      queryBuilder.andWhere('vendor.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    queryBuilder.groupBy('vendor.id').orderBy('ordersCount', findAllVendorsRequestDto.orderByType);
    if (findAllVendorsRequestDto.paginationEnable) queryBuilder.skip(offset).take(findAllVendorsRequestDto.limit);
    const { entities, raw }: { entities: Vendor[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i].locationsVendors = await this.locationsVendorsService.findAllByVendorId(entities[i].id, {
        location: true,
      });
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return findAllVendorsRequestDto.paginationEnable
      ? {
          perPage: findAllVendorsRequestDto.limit,
          currentPage: findAllVendorsRequestDto.page,
          lastPage: Math.ceil(count / findAllVendorsRequestDto.limit),
          total: count,
          data: entities,
        }
      : { total: count, data: entities };
  }

  // create.
  async create(authedUser: AuthedUser, createVendorRequestDto: CreateVendorRequestDto, files?: Express.Multer.File[]): Promise<Vendor> {
    const governorate: Location = await this.adminVendorsValidation.validateCreation(createVendorRequestDto);
    const {
      createAttachmentPayloadDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
    } = await this.adminVendorsValidation.validateCreationUploadDocuments(authedUser, createVendorRequestDto, files);
    let avatarUrl: string;
    if (avatar) {
      avatarUrl = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          file: avatar,
        }),
      );
    }
    const savedVendor: Vendor = await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatarUrl,
        status: VendorStatus.PENDING,
        ...createVendorRequestDto,
      }),
    );
    const locationsVendors: LocationVendor[] = createVendorRequestDto.regionsIds.map(
      (value: number) =>
        <LocationVendor>{
          vendorId: savedVendor.id,
          locationId: value,
        },
    );
    createAttachmentPayloadDtoList.forEach((value: CreateAttachmentPayloadDto) => {
      value.vendorId = savedVendor.id;
    });
    const attachments: Attachment[] = [];
    for (const createAttachmentPayloadDto of createAttachmentPayloadDtoList) {
      const fileUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
          file: createAttachmentPayloadDto.file,
        }),
      );
      attachments.push(<Attachment>{
        documentId: createAttachmentPayloadDto.documentId,
        vendorId: createAttachmentPayloadDto.vendorId,
        file: fileUrl,
      });
    }
    savedVendor.locationsVendors = locationsVendors;
    savedVendor.attachments = attachments;
    savedVendor.governorate = governorate;
    return await this.vendorRepository.save(savedVendor);
  }

  // update.
  async update(authedUser: AuthedUser, vendorId: number, updateVendorRequestDto: UpdateVendorRequestDto, files?: Express.Multer.File[]): Promise<Vendor> {
    const vendor: Vendor = await this.adminVendorsValidation.validateUpdate(vendorId, updateVendorRequestDto);
    const {
      createAttachmentPayloadDtoList,
      avatar,
    }: {
      avatar?: any;
      createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
    } = await this.adminVendorsValidation.validateUpdateUploadDocuments(authedUser, vendor, files);
    if (avatar) {
      if (vendor.avatar)
        await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(
          new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
          new DeleteFilePayloadDto({
            prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
            fileUrl: vendor.avatar,
          }),
        );
      vendor.avatar = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          file: avatar,
        }),
      );
    }
    Object.assign(vendor, updateVendorRequestDto);
    const savedVendor: Vendor = await this.vendorRepository.save(vendor);
    if (updateVendorRequestDto.regionsIds) {
      for (const locationVendor of savedVendor.locationsVendors) {
        await this.locationsVendorsService.removeOneByInstance(locationVendor);
      }
      // prepare regions.
      savedVendor.locationsVendors = updateVendorRequestDto.regionsIds.map(
        (value: number) =>
          <LocationVendor>{
            vendorId: savedVendor.id,
            locationId: value,
          },
      );
    }
    const attachments: Attachment[] = [];
    for (const createAttachmentPayloadDto of createAttachmentPayloadDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.findAllByVendorIdAndDocumentId(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto({
          vendorId: savedVendor.id,
          documentId: createAttachmentPayloadDto.documentId,
        }),
      );
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.removeOneByInstance(new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }), oldAttachment);
          savedVendor.attachments = savedVendor.attachments.filter((attachment: Attachment): boolean => attachment.id !== oldAttachment.id);
        }
      }
      const fileUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          file: avatar,
        }),
      );
      attachments.push(<Attachment>{
        documentId: createAttachmentPayloadDto.documentId,
        vendorId: createAttachmentPayloadDto.vendorId,
        file: fileUrl,
      });
    }
    savedVendor.attachments = [...savedVendor.attachments, ...attachments];
    return this.vendorRepository.save(savedVendor);
  }

  // remove.
  async remove(id: number): Promise<Vendor> {
    const vendor: Vendor = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id,
      }),
    );
    return this.vendorRepository.remove(vendor);
  }

  // export all.
  async exportAll(findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<StreamableFile> {
    const { data }: { data: Vendor[] } = await this.findAll(findAllVendorsRequestDto);
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
