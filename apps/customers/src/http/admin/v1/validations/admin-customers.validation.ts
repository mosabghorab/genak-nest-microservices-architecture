import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { AdminCustomersService } from '../services/admin-customers.service';
import { CreateCustomerRequestDto } from '../dtos/create-customer-request.dto';
import { Customer, FindOneByPhonePayloadDto, FindOneOrFailByIdPayloadDto, Location, LocationsMicroserviceConnection, LocationsMicroserviceConstants } from '@app/common';
import { UpdateCustomerRequestDto } from '../dtos/update-customer-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class AdminCustomersValidation {
  private readonly locationsMicroserviceConnection: LocationsMicroserviceConnection;

  constructor(
    @Inject(forwardRef(() => AdminCustomersService))
    private readonly adminCustomersService: AdminCustomersService,
    @Inject(LocationsMicroserviceConstants.NAME)
    private readonly locationsMicroservice: ClientProxy,
  ) {
    this.locationsMicroserviceConnection = new LocationsMicroserviceConnection(locationsMicroservice, Constants.LOCATIONS_MICROSERVICE_VERSION);
  }

  // validate creation.
  async validateCreation(createCustomerDto: CreateCustomerRequestDto): Promise<void> {
    const customerByPhone: Customer = await this.adminCustomersService.findOneByPhone(
      new FindOneByPhonePayloadDto<Customer>({
        phone: createCustomerDto.phone,
      }),
    );
    if (customerByPhone) {
      throw new BadRequestException('Phone is already exists.');
    }
    const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: createCustomerDto.governorateId,
        failureMessage: 'Governorate not found.',
      }),
    );
    const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id: createCustomerDto.regionId,
        failureMessage: 'Region not found.',
      }),
    );
    if (region.parentId !== governorate.id) {
      throw new BadRequestException('The provided region is not a child for the provided governorate.');
    }
  }

  // validate update.
  async validateUpdate(customerId: number, updateCustomerDto: UpdateCustomerRequestDto): Promise<Customer> {
    const customer: Customer = await this.adminCustomersService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: customerId,
      }),
    );
    if (updateCustomerDto.phone) {
      const customerByPhone: Customer = await this.adminCustomersService.findOneByPhone(
        new FindOneByPhonePayloadDto<Customer>({
          phone: updateCustomerDto.phone,
        }),
      );
      if (customerByPhone) {
        throw new BadRequestException('Phone is already exists.');
      }
    }
    if (updateCustomerDto.governorateId) {
      const governorate: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: updateCustomerDto.governorateId,
          failureMessage: 'Governorate not found.',
        }),
      );
      const region: Location = await this.locationsMicroserviceConnection.locationsServiceImpl.findOneOrFailById(
        new FindOneOrFailByIdPayloadDto<Location>({
          id: updateCustomerDto.regionId,
          failureMessage: 'Region not found.',
        }),
      );
      if (region.parentId !== governorate.id) {
        throw new BadRequestException('The provided region is not a child for the provided governorate.');
      }
    }
    return customer;
  }
}
