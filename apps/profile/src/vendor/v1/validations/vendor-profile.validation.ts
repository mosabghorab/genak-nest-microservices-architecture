import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOneByPhoneDto, FindOneOrFailByIdDto, LocationsMicroserviceConstants, LocationsMicroserviceImpl, Vendor, VendorsMicroserviceConstants, VendorsMicroserviceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class VendorProfileValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(vendorId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    await this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    if (updateProfileDto.phone) {
      const vendorByPhone: Vendor = await this.vendorsMicroserviceImpl.findOneByPhone(<FindOneByPhoneDto<Vendor>>{
        phone: updateProfileDto.phone,
      });
      if (vendorByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
  }
}
