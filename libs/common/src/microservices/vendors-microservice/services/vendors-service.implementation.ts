import { ClientProxy } from '@nestjs/microservices';
import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  IVendorsService,
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
  ServiceType,
  Vendor,
  VendorSignUpPayloadDto,
  VendorsMicroserviceConstants,
  VendorStatus,
  VendorUpdateProfilePayloadDto,
  VendorUploadDocumentsPayloadDto,
} from '@app/common';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';

export class VendorsServiceImpl implements IVendorsService {
  constructor(private readonly vendorsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Vendor>): Promise<Vendor> {
    const vendor: Vendor = await this.findOneById(
      rpcAuthenticationPayloadDto,
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
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<Vendor, { findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor> }>(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByPhonePayloadDto },
      ),
    );
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

  // search by name.
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<
        Vendor[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          searchPayloadDto: SearchPayloadDto<Vendor>;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_SEARCH_BY_NAME_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          searchPayloadDto,
        },
      ),
    );
  }

  // create.
  create(vendorSignUpPayloadDto: VendorSignUpPayloadDto, avatar?: Express.Multer.File): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          vendorSignUpPayloadDto: VendorSignUpPayloadDto;
          avatar: Express.Multer.File;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_CREATE_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          vendorSignUpPayloadDto,
          avatar,
        },
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendor: Vendor): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          vendor: Vendor;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, vendor },
      ),
    );
  }

  // upload documents.
  uploadDocuments(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPLOAD_DOCUMENTS_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, vendorUploadDocumentsPayloadDto },
      ),
    );
  }

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto): Promise<Vendor> {
    return firstValueFrom<Vendor>(
      this.vendorsMicroservice.send<
        Vendor,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, vendorUpdateProfilePayloadDto },
      ),
    );
  }

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType?: ServiceType, status?: VendorStatus): Promise<number> {
    return firstValueFrom<number>(
      this.vendorsMicroservice.send<
        number,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType?: ServiceType;
          status?: VendorStatus;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          status,
        },
      ),
    );
  }

  // find best sellers with orders count.
  findBestSellersWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<
        Vendor[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          serviceType: ServiceType;
          dateFilterPayloadDto: DateFilterPayloadDto;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_BEST_SELLERS_WITH_ORDERS_COUNT_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          serviceType,
          dateFilterPayloadDto,
        },
      ),
    );
  }

  // find latest.
  findLatest(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]> {
    return firstValueFrom<Vendor[]>(
      this.vendorsMicroservice.send<
        Vendor[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          count: number;
          serviceType: ServiceType;
          relations?: FindOptionsRelations<Vendor>;
        }
      >(
        {
          cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_LATEST_MESSAGE_PATTERN}/v${this.version}`,
        },
        {
          rpcAuthenticationPayloadDto,
          count,
          serviceType,
          relations,
        },
      ),
    );
  }
}
