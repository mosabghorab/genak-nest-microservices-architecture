import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, ILike, Repository } from 'typeorm';
import {
  Attachment,
  AttachmentsMicroserviceConnection,
  AttachmentsMicroserviceConstants,
  DateFilterOption,
  DateFilterPayloadDto,
  DateHelpers,
  DeleteFilePayloadDto,
  FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  OrderByType,
  SearchPayloadDto,
  ServiceType,
  StorageMicroserviceConnection,
  StorageMicroserviceConstants,
  UploadFilePayloadDto,
  Vendor,
  VendorSignUpPayloadDto,
  VendorStatus,
  VendorUpdateProfilePayloadDto,
  VendorUploadDocumentsPayloadDto,
} from '@app/common';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class VendorsService {
  private readonly attachmentsMicroserviceConnection: AttachmentsMicroserviceConnection;
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
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

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor>): Promise<Vendor | null> {
    return this.vendorRepository.findOne({
      where: { phone: findOneByPhonePayloadDto.phone },
      relations: findOneByPhonePayloadDto.relations,
    });
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]> {
    return this.vendorRepository.find({
      where: { name: ILike(`%${searchPayloadDto.searchQuery}%`) },
    });
  }

  // create.
  async create(vendorSignUpPayloadDto: VendorSignUpPayloadDto, avatar?: Express.Multer.File): Promise<Vendor> {
    let avatarUrl: string;
    if (avatar) {
      avatarUrl = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          file: avatar,
        }),
      );
    }
    return await this.vendorRepository.save(
      await this.vendorRepository.create({
        avatar: avatarUrl,
        ...vendorSignUpPayloadDto,
      }),
    );
  }

  // upload documents.
  async uploadDocuments(vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(
      new FindOneByIdPayloadDto<Vendor>({
        id: vendorUploadDocumentsPayloadDto.vendorId,
        relations: {
          attachments: true,
        },
      }),
    );
    const attachments: Attachment[] = [];
    for (const createAttachmentDto of vendorUploadDocumentsPayloadDto.createAttachmentPayloadDtoList) {
      const oldAttachments: Attachment[] = await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.findAllByVendorIdAndDocumentId(
        new FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto({
          vendorId: vendorUploadDocumentsPayloadDto.vendorId,
          documentId: createAttachmentDto.documentId,
        }),
      );
      if (oldAttachments) {
        for (const oldAttachment of oldAttachments) {
          await this.attachmentsMicroserviceConnection.attachmentsServiceImpl.removeOneByInstance(oldAttachment);
          vendor.attachments = vendor.attachments.filter((attachment: Attachment): boolean => attachment.id !== oldAttachment.id);
        }
      }
      const fileUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_ATTACHMENTS_PREFIX_PATH,
          file: createAttachmentDto.file,
        }),
      );
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
  async updateProfile(vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(
      new FindOneByIdPayloadDto<Vendor>({
        id: vendorUpdateProfilePayloadDto.vendorId,
      }),
    );
    if (vendorUpdateProfilePayloadDto.avatar) {
      if (vendor.avatar)
        await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(
          new DeleteFilePayloadDto({
            prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
            fileUrl: vendor.avatar,
          }),
        );
      vendor.avatar = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new UploadFilePayloadDto({
          prefixPath: Constants.VENDORS_IMAGES_PREFIX_PATH,
          file: vendorUpdateProfilePayloadDto.avatar,
        }),
      );
      delete vendorUpdateProfilePayloadDto.avatar;
    }
    Object.assign(vendor, vendorUpdateProfilePayloadDto);
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
  async findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Vendor[]> {
    let dateRange: { startDate: Date; endDate: Date };
    if (dateFilterPayloadDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: dateFilterPayloadDto.startDate,
        endDate: dateFilterPayloadDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(dateFilterPayloadDto.dateFilterOption);
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
