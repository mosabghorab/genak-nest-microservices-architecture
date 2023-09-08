import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import {
  Attachment,
  AttachmentsMicroserviceConnection,
  AttachmentsMicroserviceConstants,
  DateFilterDto,
  DateFilterOption,
  DateHelpers,
  DeleteFileDto,
  FindAllAttachmentsByVendorIdAndDocumentIdDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  OrderByType,
  ServiceType,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
  UploadFileDto,
  Vendor,
  VendorSignUpDto,
  VendorStatus,
  VendorUpdateProfileDto,
  VendorUploadDocumentsDto,
} from '@app/common';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VendorsService {
  private readonly attachmentsMicroserviceConnection: AttachmentsMicroserviceConnection;
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @Inject(AttachmentsMicroserviceConstants.NAME)
    private readonly attachmentsMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.attachmentsMicroserviceConnection = new AttachmentsMicroserviceConnection(attachmentsMicroservice, Constants.ATTACHMENTS_MICROSERVICE_VERSION);
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
      const oldAttachments: Attachment[] = await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.findAllByVendorIdAndDocumentId(<FindAllAttachmentsByVendorIdAndDocumentIdDto>{
        vendorId: vendorUploadDocumentsDto.vendorId,
        documentId: createAttachmentDto.documentId,
      });
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.removeOneByInstance(oldAttachment);
          vendor.attachments = vendor.attachments.filter((attachment: Attachment): boolean => attachment.id !== oldAttachment.id);
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

  // update profile.
  async updateProfile(vendorUpdateProfileDto: VendorUpdateProfileDto): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(<FindOneByIdDto<Vendor>>{
      id: vendorUpdateProfileDto.vendorId,
    });
    if (vendorUpdateProfileDto.avatar) {
      if (vendor.avatar)
        await this.storageMicroserviceImpl.deleteFile(<DeleteFileDto>{
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          fileUrl: vendor.avatar,
        });
      vendor.avatar = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
        file: vendorUpdateProfileDto.avatar,
      });
      delete vendorUpdateProfileDto.avatar;
    }
    Object.assign(vendor, vendorUpdateProfileDto);
    return this.vendorRepository.save(vendor);
  }

  // remove one by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor> {
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
  async findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Vendor[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterDto.startDate,
        endDate: dateFilterDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterDto.dateFilterOption);
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
