import { Body, Controller, Delete, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SendVerificationCodeRequestDto } from '../../../shared/v1/dtos/send-verification-code-request.dto';
import { SignInWithPhoneRequestDto } from '../../../shared/v1/dtos/sign-in-with-phone-request.dto';
import { AllowFor, AuthedUser, EmptyResponseDto, GetAuthedUser, Helpers, Public, Serialize, UserType, Vendor, VendorResponseDto } from '@app/common';
import { VendorAuthService } from '../services/vendor-auth.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { SignUpDto } from '../dtos/sign-up.dto';

@Controller({ path: 'vendor/auth', version: '1' })
export class VendorAuthController {
  constructor(private readonly vendorAuthService: VendorAuthService) {}

  @Public()
  @Serialize(EmptyResponseDto, 'Verification code sent successfully.')
  @Post('send-verification-code')
  sendVerificationCode(@Body() sendVerificationCodeRequestDto: SendVerificationCodeRequestDto): Promise<void> {
    return this.vendorAuthService.sendVerificationCode(sendVerificationCodeRequestDto);
  }

  @Public()
  @Serialize(VendorResponseDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  signInWithPhone(@Body() signInWithPhoneRequestDto: SignInWithPhoneRequestDto): Promise<any> {
    return this.vendorAuthService.signInWithPhone(signInWithPhoneRequestDto);
  }

  @Public()
  @Serialize(VendorResponseDto, 'You signed up successfully.')
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('avatar'))
  signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    avatar?: Express.Multer.File,
  ): Promise<Vendor> {
    return this.vendorAuthService.signUp(signUpDto, avatar);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorResponseDto, 'Documents uploaded successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload-documents')
  uploadDocuments(
    @GetAuthedUser() authedUser: AuthedUser,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.vendorAuthService.uploadDocuments(authedUser, files);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorResponseDto, 'Account deleted successfully.')
  @Delete('delete-account')
  deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Vendor> {
    return this.vendorAuthService.deleteAccount(authedUser);
  }
}
