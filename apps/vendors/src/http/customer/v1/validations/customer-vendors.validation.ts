import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { FindAllVendorsRequestDto } from '../dtos/find-all-vendors-request.dto';
import { CustomerVendorsService } from '../services/customer-vendors.service';
import { FindOneOrFailByIdPayloadDto, Location, LocationsMicroserviceConnection, LocationsMicroserviceConstants } from '@app/common';
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
  async validateFindAll(findAllVendorsRequestDto: FindAllVendorsRequestDto): Promise<void> {
    if (findAllVendorsRequestDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: findAllVendorsRequestDto.governorateId,
          failureMessage: 'Governorate not found.',
        }),
      );
      if (findAllVendorsRequestDto.regionsIds) {
        for (const regionId of findAllVendorsRequestDto.regionsIds) {
          const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
            new FindOneOrFailByIdPayloadDto<Location>({
              id: regionId,
              failureMessage: 'Region not found.',
            }),
          );
          if (region.parentId !== governorate.id) {
            throw new BadRequestException('The provided region is not a child for the provided governorate.');
          }
        }
      }
    }
  }
}
