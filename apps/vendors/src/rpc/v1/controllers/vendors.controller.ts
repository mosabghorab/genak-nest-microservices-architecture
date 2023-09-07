import { Controller } from '@nestjs/common';
import { FindOneByIdDto, FindOneByPhoneDto, Vendor, VendorSignUpDto, VendorsMicroserviceConstants, VendorUpdateProfileDto, VendorUploadDocumentsDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VendorsService } from '../services/vendors.service';

const VERSION = '1';

@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneByPhone(findOneByPhoneDto);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_CREATE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  create(@Payload('vendorSignUpDto') vendorSignUpDto: VendorSignUpDto, @Payload('avatar') avatar?: Express.Multer.File): Promise<Vendor> {
    return this.vendorsService.create(vendorSignUpDto, avatar);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneById(@Payload() vendor: Vendor): Promise<Vendor> {
    return this.vendorsService.removeOneByInstance(vendor);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPLOAD_DOCUMENTS_MESSAGE_PATTERN}/v${VERSION}`,
  })
  uploadDocuments(@Payload() vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor> {
    return this.vendorsService.uploadDocuments(vendorUploadDocumentsDto);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.VENDORS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@Payload() vendorUpdateProfileDto: VendorUpdateProfileDto): Promise<Vendor> {
    return this.vendorsService.updateProfile(vendorUpdateProfileDto);
  }
}
