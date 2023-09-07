import { Controller } from '@nestjs/common';
import { Customer, CustomerSignUpDto, CustomersMicroserviceConstants, CustomerUpdateProfileDto, FindOneByIdDto, FindOneByPhoneDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from '../services/customers.service';

const VERSION = '1';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_FIND_ONE_BY_PHONE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneByPhone(findOneByPhoneDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_CREATE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  create(@Payload() customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return this.customersService.create(customerSignUpDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_REMOVE_ONE_BY_INSTANCE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  removeOneById(@Payload() customer: Customer): Promise<Customer> {
    return this.customersService.removeOneByInstance(customer);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.CUSTOMERS_SERVICE_UPDATE_PROFILE_MESSAGE_PATTERN}/v${VERSION}`,
  })
  updateProfile(@Payload() customerUpdateProfileDto: CustomerUpdateProfileDto): Promise<Customer> {
    return this.customersService.updateProfile(customerUpdateProfileDto);
  }
}
