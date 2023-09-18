import { Inject, Injectable } from '@nestjs/common';
import { AuthedUser, FindOneOrFailByIdPayloadDto, RpcAuthenticationPayloadDto, Vendor, VendorsMicroserviceConnection, VendorsMicroserviceConstants, VendorUpdateProfilePayloadDto } from '@app/common';
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
  async update(authedUser: AuthedUser, updateProfileRequestDto: UpdateProfileRequestDto, avatar?: Express.Multer.File): Promise<Vendor> {
    await this.vendorProfileValidation.validateUpdate(authedUser, updateProfileRequestDto);
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.updateProfile(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new VendorUpdateProfilePayloadDto({
        vendorId: authedUser.id,
        ...updateProfileRequestDto,
        avatar,
      }),
    );
  }

  // find.
  find(authedUser: AuthedUser): Promise<Vendor> {
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: authedUser.id,
      }),
    );
  }
}
