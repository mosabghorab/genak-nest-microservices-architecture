import { Inject, Injectable } from '@nestjs/common';
import { FindOneOrFailByIdPayloadDto, Vendor, VendorsMicroserviceConnection, VendorsMicroserviceConstants, VendorUpdateProfilePayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { VendorProfileValidation } from '../validations/vendor-profile.validation';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

@Injectable()
export class VendorProfileService {
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(private readonly vendorProfileValidation: VendorProfileValidation, @Inject(VendorsMicroserviceConstants.NAME) private readonly vendorsMicroservice: ClientProxy) {
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // update.
  async update(vendorId: number, updateProfileRequestDto: UpdateProfileRequestDto, avatar?: Express.Multer.File): Promise<Vendor> {
    await this.vendorProfileValidation.validateUpdate(vendorId, updateProfileRequestDto);
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.updateProfile(
      new VendorUpdateProfilePayloadDto({
        vendorId,
        ...updateProfileRequestDto,
        avatar,
      }),
    );
  }

  // find.
  find(vendorId: number): Promise<Vendor> {
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
      }),
    );
  }
}
