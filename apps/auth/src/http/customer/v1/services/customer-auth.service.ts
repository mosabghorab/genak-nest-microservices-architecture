import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthedUser,
  ClientUserType,
  Customer,
  CustomerSignUpPayloadDto,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateHelpers,
  FcmToken,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  UserType,
  VerificationCode,
} from '@app/common';
import { PushTokensService } from '../../../shared/v1/services/push-tokens.service';
import { VerificationCodesService } from '../../../shared/v1/services/verification-codes.service';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { SendVerificationCodeRequestDto } from '../../../shared/v1/dtos/send-verification-code-request.dto';
import { SignInWithPhoneRequestDto } from '../../../shared/v1/dtos/sign-in-with-phone-request.dto';
import { CustomerAuthValidation } from '../validations/customer-auth.validation';
import { CreatePushTokenPayloadDto } from '../../../shared/v1/dtos/create-push-token-payload.dto';
import { FindOnePushTokenPayloadDto } from '../../../shared/v1/dtos/find-one-push-token-payload.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class CustomerAuthService {
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(
    private readonly jwtService: JwtService,
    private readonly fcmTokensService: PushTokensService,
    private readonly verificationCodesService: VerificationCodesService,
    private readonly customerAuthValidation: CustomerAuthValidation,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // send verification code.
  async sendVerificationCode(sendVerificationCodeRequestDto: SendVerificationCodeRequestDto): Promise<void> {
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailByPhone(
      new FindOneOrFailByPhonePayloadDto<Customer>({
        phone: sendVerificationCodeRequestDto.phone,
      }),
    );
    await this.verificationCodesService.create(sendVerificationCodeRequestDto.phone, ClientUserType.CUSTOMER);
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneRequestDto: SignInWithPhoneRequestDto): Promise<any> {
    const customer: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailByPhone(
      new FindOneOrFailByPhonePayloadDto<Customer>({
        phone: signInWithPhoneRequestDto.phone,
      }),
    );
    const verificationCode: VerificationCode = await this.verificationCodesService.findLastOneOrFailByPhone(signInWithPhoneRequestDto.phone, ClientUserType.CUSTOMER);
    if (signInWithPhoneRequestDto.code !== verificationCode.code) {
      throw new BadRequestException('Invalid verification code.');
    }
    if (DateHelpers.calculateTimeDifferenceInMinutes(verificationCode.createdAt, new Date()) > 3) {
      throw new BadRequestException('Expired verification code.');
    }
    const fcmToken: FcmToken = await this.fcmTokensService.findOne(<FindOnePushTokenPayloadDto>{
      tokenableId: customer.id,
      tokenableType: UserType.CUSTOMER,
      token: signInWithPhoneRequestDto.fcmToken,
    });
    if (!fcmToken) {
      await this.fcmTokensService.create(<CreatePushTokenPayloadDto>{
        tokenableId: customer.id,
        tokenableType: UserType.CUSTOMER,
        token: signInWithPhoneRequestDto.fcmToken,
      });
    }
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: customer.id,
      type: UserType.CUSTOMER,
    });
    return { ...customer, accessToken };
  }

  // sign up.
  async signUp(signUpDto: SignUpDto): Promise<Customer> {
    await this.customerAuthValidation.validateSignUp(signUpDto);
    return await this.customersMicroserviceConnection.customersServiceImpl.create(new CustomerSignUpPayloadDto({ ...signUpDto }));
  }

  // delete account.
  async deleteAccount(customerId: number): Promise<Customer> {
    const customer: Customer = await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: customerId,
      }),
    );
    return this.customersMicroserviceConnection.customersServiceImpl.removeOneByInstance(customer);
  }
}
