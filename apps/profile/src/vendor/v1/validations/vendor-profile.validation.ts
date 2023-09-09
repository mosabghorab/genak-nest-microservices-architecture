import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FindOneByPhoneDto, FindOneOrFailByIdDto, Vendor, VendorsMicroserviceConnection, VendorsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class VendorProfileValidation {
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(vendorId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    if (updateProfileDto.phone) {
      const vendorByPhone: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneByPhone(<FindOneByPhoneDto<Vendor>>{
        phone: updateProfileDto.phone,
      });
      if (vendorByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
  }
}
