import { Inject, Injectable } from '@nestjs/common';
import { FindOneOrFailByIdDto, Vendor, VendorsMicroserviceConstants, VendorsMicroserviceImpl, VendorUpdateProfileDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { VendorProfileValidation } from '../validations/vendor-profile.validation';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class VendorProfileService {
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;

  constructor(private readonly vendorProfileValidation: VendorProfileValidation, @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy) {
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // update.
  async update(vendorId: number, updateProfileDto: UpdateProfileDto, avatar?: Express.Multer.File): Promise<Vendor> {
    await this.vendorProfileValidation.validateUpdate(vendorId, updateProfileDto);
    return this.vendorsMicroserviceImpl.updateProfile(<VendorUpdateProfileDto>{
      vendorId,
      ...updateProfileDto,
      avatar,
    });
  }

  // find.
  find(vendorId: number): Promise<Vendor> {
    return this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
  }
}
