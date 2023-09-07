import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AllowFor, AuthedUser, Customer, CustomerDto, CustomerSignUpDto, EmptyDto, GetAuthedUser, Public, Serialize, UserType } from '@app/common';
import { SendVerificationCodeDto } from '../../../shared/v1/dtos/send-verification-code.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { CustomerAuthService } from '../services/customer-auth.service';

@Controller({ path: 'customer/auth', version: '1' })
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Public()
  @Serialize(EmptyDto, 'Verification code sent successfully.')
  @Post('send-verification-code')
  async sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto): Promise<void> {
    return this.customerAuthService.sendVerificationCode(sendVerificationCodeDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  async signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    return this.customerAuthService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(CustomerDto, 'You signed up successfully.')
  @Post('sign-up')
  async signUp(@Body() customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    return this.customerAuthService.signUp(customerSignUpDto);
  }

  @AllowFor(UserType.CUSTOMER)
  @Serialize(CustomerDto, 'Account deleted successfully.')
  @Delete('delete-account')
  async deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Customer> {
    return this.customerAuthService.deleteAccount(authedUser.id);
  }
}
