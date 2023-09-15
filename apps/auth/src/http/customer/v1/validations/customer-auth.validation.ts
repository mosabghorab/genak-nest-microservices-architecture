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
import { Constants } from '../../../../constants';
import { SignUpDto } from '../dtos/sign-up.dto';

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
  async validateSignUp(signUpDto: SignUpDto): Promise<void> {
    const customerByPhone: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneByPhone(
      new FindOneByPhonePayloadDto<Customer>({
        phone: signUpDto.phone,
      }),
    );
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: signUpDto.governorateId,
        failureMessage: 'Governorate not found.',
      }),
    );
    const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: signUpDto.regionId,
        failureMessage: 'Region not found.',
      }),
    );
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }
}
