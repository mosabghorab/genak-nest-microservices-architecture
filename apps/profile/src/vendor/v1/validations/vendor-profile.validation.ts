import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthedUser, FindOneByPhonePayloadDto, FindOneOrFailByIdPayloadDto, RpcAuthenticationPayloadDto, Vendor, VendorsMicroserviceConnection, VendorsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

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
  async validateUpdate(authedUser: AuthedUser, updateProfileRequestDto: UpdateProfileRequestDto): Promise<void> {
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: authedUser.id,
      }),
    );
    if (updateProfileRequestDto.phone) {
      const vendorByPhone: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneByPhone(
        new FindOneByPhonePayloadDto<Vendor>({
          phone: updateProfileRequestDto.phone,
        }),
      );
      if (vendorByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
  }
}
