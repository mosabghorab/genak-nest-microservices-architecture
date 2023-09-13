import { ClientProxy } from '@nestjs/microservices';
import {
  DateFilterDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  FindOneOrFailByPhoneDto,
  IVendorsService,
  SearchPayloadDto,
  ServiceType,
  Vendor,
  VendorSignUpDto,
  VendorsMicroserviceConstants,
  VendorStatus,
  VendorUpdateProfileDto,
  VendorUploadDocumentsDto,
} from '@app/common';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';

export class VendorsServiceImpl implements IVendorsService {
  constructor(private readonly vendorsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, FindOneByIdDto<Vendor>>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, FindOneByIdDto<Vendor>>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByIdDto<Vendor>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, FindOneByPhoneDto<Vendor>>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByPhoneDto,
      ),
    );
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, FindOneByPhoneDto<Vendor>>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByPhoneDto<Vendor>>{
          phone: findOneOrFailByPhoneDto.phone,
          relations: findOneOrFailByPhoneDto.relations,
        },
      ),
    );
    if (!vendor) {
      throw new NotFoundException(findOneOrFailByPhoneDto.failureMessage || 'Vendor not found.');
    }
    return vendor;
  }

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<Vendor[], { searchPayloadDto: SearchPayloadDto<Vendor> }>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          searchPayloadDto,
        },
      ),
    );
  }

  // create.
  create(vendorSignUpDto: VendorSignUpDto, avatar?: Express.Multer.File): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          vendorSignUpDto: VendorSignUpDto;
          avatar: Express.Multer.File;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_CREATE_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          vendorSignUpDto,
          avatar,
        },
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, Vendor>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        vendor,
      ),
    );
  }

  // upload documents.
  uploadDocuments(vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, VendorUploadDocumentsDto>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPLOAD_DOCUMENTS_MESSAGE_PATTERN}/v${this.version}`,
        },
        vendorUploadDocumentsDto,
      ),
    );
  }

  // update profile.
  updateProfile(vendorUpdateProfileDto: VendorUpdateProfileDto): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, VendorUpdateProfileDto>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        vendorUpdateProfileDto,
      ),
    );
  }

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus): Promise<number> {
    return firstValueFrom<number>(
      this.vendorsMicroservice.send<number, { serviceType?: ServiceType; status?: VendorStatus }>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          status,
        },
      ),
    );
  }

  // find best sellers with orders count.
  findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<Vendor[], { serviceType: ServiceType; dateFilterDto: DateFilterDto }>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_BEST_SELLERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          serviceType,
          dateFilterDto,
        },
      ),
    );
  }

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<
        Vendor[],
        {
          count: number;
          serviceType: ServiceType;
          relations?: FindOptionsRelations<Vendor>;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          count,
          serviceType,
          relations,
        },
      ),
    );
  }
}
