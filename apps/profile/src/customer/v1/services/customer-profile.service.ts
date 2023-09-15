import { Inject, Injectable } from '@nestjs/common';
import { Customer, CustomersMicroserviceConnection, CustomersMicroserviceConstants, CustomerUpdateProfilePayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';
import { CustomerProfileValidation } from '../validations/customer-profile.validation';
import { Constants } from '../../../constants';

@Injectable()
export class CustomerProfileService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(private readonly customerProfileValidation: CustomerProfileValidation, @Inject(CustomersMicroserviceConstants.NAME) private readonly customersMicroservice: ClientProxy) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // update.
  async update(customerId: number, updateProfileRequestDto: UpdateProfileRequestDto): Promise<Customer> {
    await this.customerProfileValidation.validateUpdate(customerId, updateProfileRequestDto);
    return this.customersMicroserviceConnection.customersServiceImpl.updateProfile(
      new CustomerUpdateProfilePayloadDto({
        customerId,
        ...updateProfileRequestDto,
      }),
    );
  }

  // find.
  find(customerId: number): Promise<Customer> {
    return this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: customerId,
      }),
    );
  }
}
