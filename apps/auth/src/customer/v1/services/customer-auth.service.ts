import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthedUser,
  ClientUserType,
  Customer,
  CustomerSignUpDto,
  CustomersMicroserviceConstants,
  CustomersMicroserviceImpl,
  DateHelpers,
  FcmToken,
  FindOneOrFailByIdDto,
  FindOneOrFailByPhoneDto,
  UserType,
  VerificationCode,
} from '@app/common';
import { FcmTokensService } from '../../../shared/v1/services/fcm-tokens.service';
import { VerificationCodesService } from '../../../shared/v1/services/verification-codes.service';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../constants';
import { SendVerificationCodeDto } from '../../../shared/v1/dtos/send-verification-code.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { CustomerAuthValidation } from '../validations/customer-auth.validation';

@Injectable()
export class CustomerAuthService {
  private readonly customersMicroserviceImpl: CustomersMicroserviceImpl;

  constructor(
    private readonly jwtService: JwtService,
    private readonly fcmTokensService: FcmTokensService,
    private readonly verificationCodesService: VerificationCodesService,
    private readonly customerAuthValidation: CustomerAuthValidation,
    @Inject(CustomersMicroserviceConstants.MICROSERVICE_NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceImpl = new CustomersMicroserviceImpl(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // send verification code.
  async sendVerificationCode(sendVerificationCodeDto: SendVerificationCodeDto): Promise<void> {
    await this.customersMicroserviceImpl.findOneOrFailByPhone(<FindOneOrFailByPhoneDto<Customer>>{
      phone: sendVerificationCodeDto.phone,
    });
    await this.verificationCodesService.create(sendVerificationCodeDto.phone, ClientUserType.CUSTOMER);
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    const customer: Customer = await this.customersMicroserviceImpl.findOneOrFailByPhone(<FindOneOrFailByPhoneDto<Customer>>{
      phone: signInWithPhoneDto.phone,
    });
    const verificationCode: VerificationCode = await this.verificationCodesService.findLastOneOrFailByPhone(signInWithPhoneDto.phone, ClientUserType.CUSTOMER);
    if (signInWithPhoneDto.code !== verificationCode.code) {
      throw new BadRequestException('Invalid verification code.');
    }
    if (DateHelpers.calculateTimeDifferenceInMinutes(verificationCode.createdAt, new Date()) > 3) {
      throw new BadRequestException('Expired verification code.');
    }
    const fcmToken: FcmToken = await this.fcmTokensService.findOne(customer.id, UserType.CUSTOMER, signInWithPhoneDto.fcmToken);
    if (!fcmToken) {
      await this.fcmTokensService.create(customer.id, UserType.CUSTOMER, signInWithPhoneDto.fcmToken);
    }
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: customer.id,
      type: UserType.CUSTOMER,
    });
    return { ...customer, accessToken };
  }

  // sign up.
  async signUp(customerSignUpDto: CustomerSignUpDto): Promise<Customer> {
    await this.customerAuthValidation.validateSignUp(customerSignUpDto);
    return await this.customersMicroserviceImpl.create(customerSignUpDto);
  }

  // delete account.
  async deleteAccount(customerId: number): Promise<Customer> {
    const customer: Customer = await this.customersMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: customerId,
    });
    return this.customersMicroserviceImpl.removeOneByInstance(customer);
  }
}
