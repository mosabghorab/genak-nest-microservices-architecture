import { Inject, Injectable } from '@nestjs/common';
import { Customer, CustomersMicroserviceConnection, CustomersMicroserviceConstants, CustomerUpdateProfileDto, FindOneOrFailByIdDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { CustomerProfileValidation } from '../validations/customer-profile.validation';
import { Constants } from '../../../constants';

@Injectable()
export class CustomerProfileService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(private readonly customerProfileValidation: CustomerProfileValidation, @Inject(CustomersMicroserviceConstants.NAME) private readonly customersMicroservice: ClientProxy) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // update.
  async update(customerId: number, updateProfileDto: UpdateProfileDto): Promise<Customer> {
    await this.customerProfileValidation.validateUpdate(customerId, updateProfileDto);
    return this.customersMicroserviceConnection.customersServiceImpl.updateProfile(<CustomerUpdateProfileDto>{
      customerId,
      ...updateProfileDto,
    });
  }

  // find.
  find(customerId: number): Promise<Customer> {
    return this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
  }
}
