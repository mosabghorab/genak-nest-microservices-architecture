import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import {
  Attachment,
  AttachmentsMicroserviceConstants,
  AttachmentsMicroserviceImpl,
  CreateAttachmentDto,
  DateFilterOption,
  DateHelpers,
  DeleteFileDto,
  FindAllAttachmentsByVendorIdAndDocumentIdDto,
  Location,
  LocationVendor,
  OrderByType,
  ServiceType,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
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

@Injectable()
export class AdminVendorsService {
  private readonly attachmentsMicroserviceImpl: AttachmentsMicroserviceImpl;
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly locationsVendorsService: LocationsVendorsService,
    @Inject(forwardRef(() => AdminVendorsValidation))
    private readonly adminVendorsValidation: AdminVendorsValidation,
    @Inject(AttachmentsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly attachmentsMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.MICROSERVICE_NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.attachmentsMicroserviceImpl = new AttachmentsMicroserviceImpl(attachmentsMicroservice, Constants.ATTACHMENTS_MICROSERVICE_VERSION);
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({ where: { id }, relations });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(id, relations);
    if (!vendor) {
      throw new NotFoundException(failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(phone: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone },
      relations,
    });
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(phone: string, failureMessage?: string, relations?: FindOptionsRelations<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneByPhone(phone, relations);
    if (!vendor) {
      throw new NotFoundException(failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find all.
  async findAll(findAllVendorsDto: FindAllVendorsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Vendor[];
    currentPage: number;
  }> {
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
    queryBuilder.groupBy('vendor.id').orderBy('ordersCount', findAllVendorsDto.orderByType).skip(offset).take(findAllVendorsDto.limit);
    const { entities, raw }: { entities: Vendor[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const count: number = await queryBuilder.getCount();
    for (let i = 0; i < entities.length; i++) {
      entities[i].locationsVendors = await this.locationsVendorsService.findAllByVendorId(entities[i].id, {
        location: true,
      });
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return {
      perPage: findAllVendorsDto.limit,
      currentPage: findAllVendorsDto.page,
      lastPage: Math.ceil(count / findAllVendorsDto.limit),
      total: count,
      data: entities,
    };
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
      avatarUrl = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
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
        await this.storageMicroserviceImpl.deleteFile(<DeleteFileDto>{
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          fileUrl: vendor.avatar,
        });
      vendor.avatar = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
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
      const oldAttachments: Attachment[] = await this.attachmentsMicroserviceImpl.findAllByVendorIdAndDocumentId(<FindAllAttachmentsByVendorIdAndDocumentIdDto>{
        vendorId: savedVendor.id,
        documentId: createAttachmentDto.documentId,
      });
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsMicroserviceImpl.removeOneByInstance(oldAttachment);
          savedVendor.attachments = savedVendor.attachments.filter((attachment: Attachment): boolean => attachment.id !== oldAttachment.id);
        }
      }
      const fileUrl: string = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
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
    const vendor: Vendor = await this.findOneOrFailById(id);
    return this.vendorRepository.remove(vendor);
  }

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus): Promise<number> {
    return this.vendorRepository.count({
      where: { serviceType, status },
    });
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { serviceType, status: VendorStatus.PENDING },
      relations,
      take: count,
    });
  }

  // find best sellers with orders count.
  async findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterOption: DateFilterOption, startDate: Date, endDate: Date): Promise<Vendor[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: startDate,
        endDate: endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterOption);
    }
    const {
      entities,
      raw,
    }: {
      entities: Vendor[];
      raw: any[];
    } = await this.vendorRepository
      .createQueryBuilder('vendor')
      .leftJoin('vendor.orders', 'order', 'order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .addSelect('COUNT(DISTINCT order.id)', 'ordersCount')
      .where('vendor.serviceType = :serviceType', { serviceType })
      .groupBy('vendor.id')
      .having('ordersCount > 0')
      .orderBy('ordersCount', OrderByType.DESC)
      .limit(5)
      .getRawAndEntities();
    for (let i = 0; i < entities.length; i++) {
      entities[i]['ordersCount'] = parseInt(raw[i]['ordersCount']) || 0;
    }
    return entities;
  }
}
