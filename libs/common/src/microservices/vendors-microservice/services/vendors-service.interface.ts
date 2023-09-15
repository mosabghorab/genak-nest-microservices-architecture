import {
  DateFilterPayloadDto,
  FindOneByIdPayloadDto,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
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
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Vendor>): Promise<Vendor>;

  // find one by phone.
  findOneByPhone(findOneByPhonePayloadDto: FindOneByPhonePayloadDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhonePayloadDto: FindOneOrFailByPhonePayloadDto<Vendor>): Promise<Vendor>;

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]>;

  // create.
  create(vendorSignUpPayloadDto: VendorSignUpPayloadDto, avatar?: Express.Multer.File): Promise<Vendor>;

  // remove on by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor>;

  // upload documents.
  uploadDocuments(vendorUploadDocumentsPayloadDto: VendorUploadDocumentsPayloadDto): Promise<Vendor>;

  // update profile.
  updateProfile(vendorUpdateProfilePayloadDto: VendorUpdateProfilePayloadDto): Promise<Vendor>;

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus): Promise<number>;

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]>;

  // find best sellers with orders count.
  findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterPayloadDto: DateFilterPayloadDto): Promise<Vendor[]>;
}
