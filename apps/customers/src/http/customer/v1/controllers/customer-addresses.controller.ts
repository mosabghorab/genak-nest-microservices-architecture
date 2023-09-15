import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomerAddressesService } from '../services/customer-addresses.service';
import { CreateCustomerAddressRequestDto } from '../dtos/create-customer-address-request.dto';
import { UpdateCustomerAddressRequestDto } from '../dtos/update-customer-address-request.dto';
import { AllowFor, AuthedUser, CustomerAddress, CustomerAddressDto, GetAuthedUser, Serialize, UserType } from '@app/common';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/addresses', version: '1' })
export class CustomerAddressesController {
  constructor(private readonly customerAddressesService: CustomerAddressesService) {}

  @Serialize(CustomerAddressDto, 'Address created successfully.')
  @Post()
  create(@GetAuthedUser() authedUser: AuthedUser, @Body() createCustomerAddressRequestDto: CreateCustomerAddressRequestDto): Promise<CustomerAddress> {
    return this.customerAddressesService.create(authedUser.id, createCustomerAddressRequestDto);
  }

  @Serialize(CustomerAddressDto, 'All addresses.')
  @Get()
  findAll(@GetAuthedUser() authedUser: AuthedUser): Promise<CustomerAddress[]> {
    return this.customerAddressesService.findAll(authedUser.id);
  }

  @Serialize(CustomerAddressDto, 'Address updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCustomerAddressRequestDto: UpdateCustomerAddressRequestDto): Promise<CustomerAddress> {
    return this.customerAddressesService.update(id, updateCustomerAddressRequestDto);
  }

  @Serialize(CustomerAddressDto, 'Address removed successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<CustomerAddress> {
    return this.customerAddressesService.remove(id);
  }
}
