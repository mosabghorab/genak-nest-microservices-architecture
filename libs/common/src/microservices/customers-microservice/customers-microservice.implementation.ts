import { Customer, CustomerSignUpDto, CustomersMicroserviceConstants, FindOneByIdDto, FindOneByPhoneDto, FindOneOrFailByIdDto, FindOneOrFailByPhoneDto, ICustomersMicroservice } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class CustomersMicroserviceImpl implements ICustomersMicroservice {
  constructor(private readonly customersMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Customer>): Promise<Customer> {
    const customer: Customer = await firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${this.version}`,
        },
        <FindOneByIdDto<Customer>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!customer) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // find one by phone.
  findOneByPhone(findOneByPhoneDto: FindOneByPhoneDto<Customer>): Promise<Customer | null> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${this.version}`,
        },
        findOneByPhoneDto,
      ),
    );
  }

  // find one or fail by phone.
  async findOneOrFailByPhone(findOneOrFailByPhoneDto: FindOneOrFailByPhoneDto<Customer>): Promise<Customer> {
    const customer: Customer = await firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_PHONE}/v${this.version}`,
        },
        <FindOneByPhoneDto<Customer>>{
          phone: findOneOrFailByPhoneDto.phone,
          relations: findOneOrFailByPhoneDto.relations,
        },
      ),
    );
    if (!customer) {
      throw new NotFoundException(findOneOrFailByPhoneDto.failureMessage || 'Customer not found.');
    }
    return customer;
  }

  // create.
  create(customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_CREATE}/v${this.version}`,
        },
        customerSignUpDto,
      ),
    );
  }

  // remove on by instance.
  removeOneByInstance(customer: Customer): Promise<Customer> {
    return firstValueFrom<Customer>(
      this.customersMicroservice.send(
        {
          cmd: `${CustomersMicroserviceConstants.MICROSERVICE_FUNCTION_REMOVE_ONE_BY_INSTANCE}/v${this.version}`,
        },
        customer,
      ),
    );
  }
}
