import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByPhonePayloadDto,
  FindOneOrFailByIdPayloadDto,
  Location,
  LocationsMicroserviceConnection,
  LocationsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';

@Injectable()
export class CustomerProfileValidation {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // validate update.
  async validateUpdate(customerId: number, updateProfileRequestDto: UpdateProfileRequestDto): Promise<void> {
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: customerId,
      }),
    );
    if (updateProfileRequestDto.phone) {
      const customerByPhone: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneByPhone(
        new FindOneByPhonePayloadDto<Customer>({
          phone: updateProfileRequestDto.phone,
        }),
      );
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateProfileRequestDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: updateProfileRequestDto.governorateId,
          failureMessage: 'Governorate not found.',
        }),
      );
      const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: updateProfileRequestDto.regionId,
          failureMessage: 'Region not found.',
        }),
      );
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
  }
}
