import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AllowFor, AuthedUser, Customer, CustomerDto, GetAuthedUser, Serialize, UserType } from '@app/common';
import { CustomerProfileService } from '../services/customer-profile.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/profile', version: '1' })
export class CustomerProfileController {
  constructor(private readonly customerProfileService: CustomerProfileService) {}

  @Serialize(CustomerDto, 'Profile updated successfully.')
  @Patch()
  update(@GetAuthedUser() authedUser: AuthedUser, @Body() updateProfileDto: UpdateProfileDto): Promise<Customer> {
    return this.customerProfileService.update(authedUser.id, updateProfileDto);
  }

  @Serialize(CustomerDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Customer> {
    return this.customerProfileService.find(authedUser.id);
  }
}
