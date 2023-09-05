import { Controller } from '@nestjs/common';
import { FindOneByIdDto, FindOneByPhoneDto, Vendor, VendorSignUpDto, VendorsMicroserviceConstants, VendorUploadDocumentsDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { VendorsService } from '../services/vendors.service';

const VERSION = '1';

@Controller()
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByPhoneDto: FindOneByPhoneDto<Vendor>): Promise<Vendor | null> {
    return this.vendorsService.findOneByPhone(findOneByPhoneDto);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_CREATE}/v${VERSION}`,
  })
  create(@Payload('vendorSignUpDto') vendorSignUpDto: VendorSignUpDto, @Payload('avatar') avatar?: Express.Multer.File): Promise<Vendor> {
    return this.vendorsService.create(vendorSignUpDto, avatar);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${VERSION}`,
  })
  removeOneById(@Payload() vendor: Vendor): Promise<Vendor> {
    return this.vendorsService.removeOneByInstance(vendor);
  }

  @MessagePattern({
    cmd: `${VendorsMicroserviceConstants.MICROSERVICE_FUNCTION_UPLOAD_DOCUMENTS}/v${VERSION}`,
  })
  uploadDocuments(@Payload() vendorUploadDocumentsDto: VendorUploadDocumentsDto): Promise<Vendor> {
    return this.vendorsService.uploadDocuments(vendorUploadDocumentsDto);
  }
}
