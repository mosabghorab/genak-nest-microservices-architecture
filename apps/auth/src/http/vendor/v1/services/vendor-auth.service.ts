import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendVerificationCodeRequestDto } from '../../../shared/v1/dtos/send-verification-code-request.dto';
import { SignInWithPhoneRequestDto } from '../../../shared/v1/dtos/sign-in-with-phone-request.dto';
import { PushTokensService } from '../../../shared/v1/services/push-tokens.service';
import { VerificationCodesService } from '../../../shared/v1/services/verification-codes.service';
import {
  AuthedUser,
  ClientUserType,
  CreateAttachmentPayloadDto,
  DateHelpers,
  FcmToken,
  FindOneOrFailByIdPayloadDto,
  FindOneOrFailByPhonePayloadDto,
  UserType,
  Vendor,
  VendorSignUpPayloadDto,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
  VendorUploadDocumentsPayloadDto,
  VerificationCode,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { VendorAuthValidation } from '../validations/vendor-auth.validation';
import { FindOnePushTokenPayloadDto } from '../../../shared/v1/dtos/find-one-push-token-payload.dto';
import { CreatePushTokenPayloadDto } from '../../../shared/v1/dtos/create-push-token-payload.dto';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class VendorAuthService {
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    private readonly jwtService: JwtService,
    private readonly fcmTokensService: PushTokensService,
    private readonly verificationCodesService: VerificationCodesService,
    private readonly vendorAuthValidation: VendorAuthValidation,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // send verification code.
  async sendVerificationCode(sendVerificationCodeRequestDto: SendVerificationCodeRequestDto): Promise<void> {
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailByPhone(
      new FindOneOrFailByPhonePayloadDto<Vendor>({
        phone: sendVerificationCodeRequestDto.phone,
      }),
    );
    await this.verificationCodesService.create(sendVerificationCodeRequestDto.phone, ClientUserType.VENDOR);
  }

  // sign in with phone.
  async signInWithPhone(signInWithPhoneRequestDto: SignInWithPhoneRequestDto): Promise<any> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailByPhone(
      new FindOneOrFailByPhonePayloadDto<Vendor>({
        phone: signInWithPhoneRequestDto.phone,
      }),
    );
    const verificationCode: VerificationCode = await this.verificationCodesService.findLastOneOrFailByPhone(signInWithPhoneRequestDto.phone, ClientUserType.VENDOR);
    if (signInWithPhoneRequestDto.code !== verificationCode.code) {
      throw new BadRequestException('Invalid verification code.');
    }
    if (DateHelpers.calculateTimeDifferenceInMinutes(verificationCode.createdAt, new Date()) > 3) {
      throw new BadRequestException('Expired verification code.');
    }
    const fcmToken: FcmToken = await this.fcmTokensService.findOne(<FindOnePushTokenPayloadDto>{
      tokenableId: vendor.id,
      tokenableType: UserType.VENDOR,
      token: signInWithPhoneRequestDto.fcmToken,
    });
    if (!fcmToken) {
      await this.fcmTokensService.create(<CreatePushTokenPayloadDto>{
        tokenableId: vendor.id,
        tokenableType: UserType.VENDOR,
        token: signInWithPhoneRequestDto.fcmToken,
      });
    }
    const accessToken: string = await this.jwtService.signAsync(<AuthedUser>{
      id: vendor.id,
      type: UserType.VENDOR,
    });
    return { ...vendor, accessToken };
  }

  // sign up.
  async signUp(signUpDto: SignUpDto, avatar?: Express.Multer.File): Promise<Vendor> {
    await this.vendorAuthValidation.validateSignUp(signUpDto);
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.create(new VendorSignUpPayloadDto({ ...signUpDto }), avatar);
  }

  // upload documents.
  async uploadDocuments(vendorId: number, files?: Express.Multer.File[]): Promise<Vendor> {
    const {
      createAttachmentPayloadDtoList,
      vendor,
    }: {
      vendor: Vendor;
      createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];
    } = await this.vendorAuthValidation.validateUploadDocuments(vendorId, files);
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.uploadDocuments(
      new VendorUploadDocumentsPayloadDto({
        vendorId: vendor.id,
        createAttachmentPayloadDtoList,
      }),
    );
  }

  // delete account.
  async deleteAccount(vendorId: number): Promise<Vendor> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
      }),
    );
    return this.vendorsMicroserviceConnection.vendorsServiceImpl.removeOneByInstance(vendor);
  }
}
