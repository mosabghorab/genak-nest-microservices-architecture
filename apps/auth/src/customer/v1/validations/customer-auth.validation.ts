import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Customer,
  CustomerSignUpDto,
  CustomersMicroserviceConstants,
  CustomersMicroserviceImpl,
  FindOneByPhoneDto,
  FindOneOrFailByIdDto,
  Location,
  LocationsMicroserviceConstants,
  LocationsMicroserviceImpl,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';

@Injectable()
export class CustomerAuthValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;
  private readonly customersMicroserviceImpl: CustomersMicroserviceImpl;

  constructor(
    @Inject(LocationsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly locationsMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.MICROSERVICE_NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
    this.customersMicroserviceImpl = new CustomersMicroserviceImpl(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // validate sign up.
  async validateSignUp(customerSignUpDto: CustomerSignUpDto): Promise<void> {
    const customerByPhone: Customer = await this.customersMicroserviceImpl.findOneByPhone(<FindOneByPhoneDto<Customer>>{
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
