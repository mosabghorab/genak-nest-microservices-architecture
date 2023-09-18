import { Inject, Injectable } from '@nestjs/common';
import {
  AuthedUser,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  CustomerUpdateProfilePayloadDto,
  FindOneOrFailByIdPayloadDto,
  RpcAuthenticationPayloadDto,
} from '@app/common';
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
  async update(authedUser: AuthedUser, updateProfileRequestDto: UpdateProfileRequestDto): Promise<Customer> {
    await this.customerProfileValidation.validateUpdate(authedUser, updateProfileRequestDto);
    return this.customersMicroserviceConnection.customersServiceImpl.updateProfile(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new CustomerUpdateProfilePayloadDto({
        customerId: authedUser.id,
        ...updateProfileRequestDto,
      }),
    );
  }

  // find.
  find(authedUser: AuthedUser): Promise<Customer> {
    return this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: authedUser.id,
      }),
    );
  }
}
