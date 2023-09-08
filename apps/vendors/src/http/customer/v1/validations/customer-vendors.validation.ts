import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindAllVendorsDto } from '../dtos/find-all-vendors.dto';
import { CustomerVendorsService } from '../services/customer-vendors.service';
import { FindOneOrFailByIdDto, Location, LocationsMicroserviceConnection, LocationsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class CustomerVendorsValidation {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;

  constructor(
    @Inject(forwardRef(() => CustomerVendorsService))
    private readonly customerVendorsService: CustomerVendorsService,
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
  }

  // validate find all.
  async validateFindAll(findAllVendorsDto: FindAllVendorsDto): Promise<void> {
    if (findAllVendorsDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: findAllVendorsDto.governorateId,
        failureMessage: 'Governorate not found.',
      });
      if (findAllVendorsDto.regionsIds) {
        for (const regionId of findAllVendorsDto.regionsIds) {
          const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
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
