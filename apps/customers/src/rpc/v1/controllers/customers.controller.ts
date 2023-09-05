import { Controller } from '@nestjs/common';
import { Customer, CustomerSignUpDto, CustomersMicroserviceConstants, FindOneByIdDto, FindOneByPhoneDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomersService } from '../services/customers.service';

const VERSION = '1';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneById(findOneByIdDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${VERSION}`,
  })
  findOneByPhone(@Payload() findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return this.customersService.findOneByPhone(findOneByPhoneDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_CREATE}/v${VERSION}`,
  })
  create(@Payload() customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return this.customersService.create(customerSignUpDto);
  }

  @MessagePattern({
    cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${VERSION}`,
  })
  removeOneById(@Payload() customer: Customer): Promise<Customer> {
    return this.customersService.removeOneByInstance(customer);
  }
}
