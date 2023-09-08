import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Customer,
  CustomerSignUpDto,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConnection,
  LocationsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class CustomerAuthValidation {
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

  // validate sign up.
  async validateSignUp(customerSignUpDto: CustomerSignUpDto): Promise<void> {
    const customerByPhone: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneByPhone(<FindOneByPhoneDto<Customer>>{
      phone: customerSignUpDto.phone,
    });
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: customerSignUpDto.governorateId,
      failureMessage: 'Governorate not found.',
    });
    const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: customerSignUpDto.regionId,
      failureMessage: 'Region not found.',
    });
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }
}
