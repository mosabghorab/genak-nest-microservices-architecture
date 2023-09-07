import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Customer,
  CustomerSignUpDto,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConstants,
  LocationsMicroserviceImpl,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class CustomerAuthValidation {
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

  // validate sign up.
  async validateSignUp(customerSignUpDto: CustomerSignUpDto): Promise<void> {
    const customerByPhone: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneByPhone(<FindOneByPhoneDto<Customer>>{
      phone: customerSignUpDto.phone,
    });
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: customerSignUpDto.governorateId,
      failureMessage: 'Governorate not found.',
    });
    const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: customerSignUpDto.regionId,
      failureMessage: 'Region not found.',
    });
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }
}
