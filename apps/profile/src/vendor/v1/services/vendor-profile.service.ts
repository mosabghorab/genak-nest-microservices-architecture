import { Inject, Injectable } from '@nestjs/common';
import { FindOneOrFailByIdDto, Vendor, VendorsMicroserviceConnection, VendorsMicroserviceConstants, VendorUpdateProfileDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { VendorProfileValidation } from '../validations/vendor-profile.validation';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class VendorProfileService {
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(private readonly vendorProfileValidation: VendorProfileValidation, @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy) {
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // update.
  async update(vendorId: number, updateProfileDto: UpdateProfileDto, avatar?: Express.Multer.File): Promise<Vendor> {
    await this.vendorProfileValidation.validateUpdate(vendorId, updateProfileDto);
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.updateProfile(<VendorUpdateProfileDto>{
      vendorId,
      ...updateProfileDto,
      avatar,
    });
  }

  // find.
  find(vendorId: number): Promise<Vendor> {
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
  }
}
