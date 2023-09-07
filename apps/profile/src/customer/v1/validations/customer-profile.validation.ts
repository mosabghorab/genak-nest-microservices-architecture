import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConstants,
  LocationsMicroserviceImpl,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class CustomerProfileValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(customerId: number, updateProfileDto: UpdateProfileDto): Promise<void> {
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
    if (updateProfileDto.phone) {
      const customerByPhone: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneByPhone(<FindOneByPhoneDto<Customer>>{
        phone: updateProfileDto.phone,
      });
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateProfileDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: updateProfileDto.governorateId,
        failureMessage: 'Governorate not found.',
      });
      const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: updateProfileDto.regionId,
        failureMessage: 'Region not found.',
      });
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
  }
}
