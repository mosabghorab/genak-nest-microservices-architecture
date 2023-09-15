import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';
import { AllowFor, AuthedUser, Customer, CustomerResponseDto, GetAuthedUser, Serialize, UserType } from '@app/common';
import { CustomerProfileService } from '../services/customer-profile.service';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/profile', version: '1' })
export class CustomerProfileController {
  constructor(private readonly customerProfileService: CustomerProfileService) {}

  @Serialize(CustomerResponseDto, 'Profile updated successfully.')
  @Patch()
  update(@GetAuthedUser() authedUser: AuthedUser, @Body() updateProfileRequestDto: UpdateProfileRequestDto): Promise<Customer> {
    return this.customerProfileService.update(authedUser.id, updateProfileRequestDto);
  }

  @Serialize(CustomerResponseDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Customer> {
    return this.customerProfileService.find(authedUser.id);
  }
}
