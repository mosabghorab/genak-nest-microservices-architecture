import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { CustomerVendorsService } from '../services/customer-vendors.service';
import { FindOneOrFailByIdDto, Location, LocationsMicroserviceConstants, LocationsMicroserviceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class CustomerVendorsValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;

  constructor(
    @Inject(forwardRef(() => CustomerVendorsService))
    private readonly customerVendorsService: CustomerVendorsService,
    @Inject(LocationsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly locationsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
  }

  // validate find all.
  async validateFindAll(findAllVendorsDto: FindAllVendorsDto): Promise<void> {
    if (findAllVendorsDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: findAllVendorsDto.governorateId,
        failureMessage: 'Governorate not found.',
      });
      if (findAllVendorsDto.regionsIds) {
        for (const regionId of findAllVendorsDto.regionsIds) {
          const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
            id: regionId,
            failureMessage: 'Region not found.',
          });
          if (region.parentId !== governorate.id) {
            throw new BadRequestException('The provided region is not a child for the provided governorate.');
          }
        }
      }
    }
  }
}
