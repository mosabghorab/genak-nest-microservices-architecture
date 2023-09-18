import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  RpcAuthenticationPayloadDto,
  SearchPayloadDto,
  ServiceType,
  Vendor,
  VendorSignUpPayloadDto,
  VendorStatus,
  VendorUpdateProfilePayloadDto,
  VendorUploadDocumentsPayloadDto,
} from '@app/common';
import { FindOptionsRelations } from 'typeorm';

export interface IVendorsService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Vendor>): Promise<Vendor>;

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Vendor>): Promise<Vendor>;

  // search by name.
  searchByName(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]>;

  // create.
  create(vendorSignUpPayloadDto: VendorSignUpPayloadDto, avatar?: Express.Multer.File): Promise<Vendor>;

  // remove on by instance.
  removeOneByInstance(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendor: Vendor): Promise<Vendor>;

  // upload documents.
  uploadDocuments(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto): Promise<Vendor>;

  // update profile.
  updateProfile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto): Promise<Vendor>;

  // count.
  count(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType?: ServiceType, status?: VendorStatus): Promise<number>;

  // find latest.
  findLatest(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]>;

  // find best sellers with orders count.
  findBestSellersWithOrdersCount(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Vendor[]>;
}
