import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { AdminCustomersService } from '../services/admin-customers.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer, FindOneByPhoneDto, FindOneOrFailByIdDto, Location, LocationsMicroserviceConstants, LocationsMicroserviceImpl } from '@app/common';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class AdminCustomersValidation {
  private readonly locationsMicroserviceImpl: LocationsMicroserviceImpl;

  constructor(
    @Inject(forwardRef(() => AdminCustomersService))
    private readonly adminCustomersService: AdminCustomersService,
    @Inject(LocationsMicroserviceConstants.MICROSERVICE_NAME)
    private readonly locationsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceImpl = new LocationsMicroserviceImpl(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
  }

  // validate creation.
  async validateCreation(createCustomerDto: CreateCustomerDto): Promise<void> {
    const customerByPhone: Customer = await this.adminCustomersService.findOneByPhone(<FindOneByPhoneDto<Customer>>{
      phone: createCustomerDto.phone,
    });
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: createCustomerDto.governorateId,
      failureMessage: 'Governorate not found.',
    });
    const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
      id: createCustomerDto.regionId,
      failureMessage: 'Region not found.',
    });
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }

  // validate update.
  async validateUpdate(customerId: number, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const customer: Customer = await this.adminCustomersService.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
    if (updateCustomerDto.phone) {
      const customerByPhone: Customer = await this.adminCustomersService.findOneByPhone(<FindOneByPhoneDto<Customer>>{
        phone: updateCustomerDto.phone,
      });
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateCustomerDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: updateCustomerDto.governorateId,
        failureMessage: 'Governorate not found.',
      });
      const region: Location = await this.locationsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Location>>{
        id: updateCustomerDto.regionId,
        failureMessage: 'Region not found.',
      });
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return customer;
  }
}
