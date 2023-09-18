import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AllowFor, AuthedUser, Customer, CustomerResponseDto, EmptyResponseDto, GetAuthedUser, Public, Serialize, UserType } from '@app/common';
import { SendVerificationCodeRequestDto } from '../../../shared/v1/dtos/send-verification-code-request.dto';
import { SignInWithPhoneRequestDto } from '../../../shared/v1/dtos/sign-in-with-phone-request.dto';
import { CustomerAuthService } from '../services/customer-auth.service';
import { SignUpDto } from '../dtos/sign-up.dto';

@Controller({ path: 'customer/auth', version: '1' })
export class CustomerAuthController {
  constructor(private readonly customerAuthService: CustomerAuthService) {}

  @Public()
  @Serialize(EmptyResponseDto, 'Verification code sent successfully.')
  @Post('send-verification-code')
  async sendVerificationCode(@Body() sendVerificationCodeRequestDto: SendVerificationCodeRequestDto): Promise<void> {
    return this.customerAuthService.sendVerificationCode(sendVerificationCodeRequestDto);
  }

  @Public()
  @Serialize(CustomerResponseDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  async signInWithPhone(@Body() signInWithPhoneRequestDto: SignInWithPhoneRequestDto): Promise<any> {
    return this.customerAuthService.signInWithPhone(signInWithPhoneRequestDto);
  }

  @Public()
  @Serialize(CustomerResponseDto, 'You signed up successfully.')
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<Customer> {
    return this.customerAuthService.signUp(signUpDto);
  }

  @AllowFor(UserType.CUSTOMER)
  @Serialize(CustomerResponseDto, 'Account deleted successfully.')
  @Delete('delete-account')
  async deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Customer> {
    return this.customerAuthService.deleteAccount(authedUser);
  }
}
