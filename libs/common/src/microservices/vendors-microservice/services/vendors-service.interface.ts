import {
  DateFilterDto,
  FindOneByIdDto,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  FindOneOrFailByPhoneDto,
  SearchPayloadDto,
  ServiceType,
  Vendor,
  VendorSignUpDto,
  VendorStatus,
  VendorUpdateProfileDto,
  VendorUploadDocumentsDto,
} from '@app/common';
import { FindOptionsRelations } from 'typeorm';

export interface IVendorsService {
  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by id.
  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Vendor>): Promise<Vendor>;

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null>;

  // find one or fail by phone.
  findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Vendor>): Promise<Vendor>;

  // search by name.
  searchByName(searchPayloadDto: SearchPayloadDto<Vendor>): Promise<Vendor[]>;

  // create.
  create(vendorSignUpDto: VendorSignUpDto, avatar?: Express.Multer.File): Promise<Vendor>;

  // remove on by instance.
  removeOneByInstance(vendor: Vendor): Promise<Vendor>;

  // upload documents.
  uploadDocuments(vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor>;

  // update profile.
  updateProfile(vendorUpdateProfileDto: VendorUpdateProfileDto): Promise<Vendor>;

  // count.
  count(serviceType?: ServiceType, status?: VendorStatus): Promise<number>;

  // find latest.
  findLatest(count: number, serviceType: ServiceType, relations?: FindOptionsRelations<Vendor>): Promise<Vendor[]>;

  // find best sellers with orders count.
  findBestSellersWithOrdersCount(serviceType: ServiceType, dateFilterDto: DateFilterDto): Promise<Vendor[]>;
}
