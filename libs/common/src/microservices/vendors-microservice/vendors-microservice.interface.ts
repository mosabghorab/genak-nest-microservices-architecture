import { FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto, Vendor, VendorSignUpDto, VendorUpdateProfileDto, VendorUploadDocumentsDto } from '@app/common';

export interface IVendorsMicroservice {
  findOneById(findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null>;

  findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Vendor>): Promise<Vendor>;

  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null>;

  findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Vendor>): Promise<Vendor>;

  create(vendorSignUpDto: VendorSignUpDto, avatar?: Express.Multer.File): Promise<Vendor>;

  removeOneByInstance(vendor: Vendor): Promise<Vendor>;

  uploadDocuments(vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor>;

  updateProfile(vendorUpdateProfileDto: VendorUpdateProfileDto): Promise<Vendor>;
}
