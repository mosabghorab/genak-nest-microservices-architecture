import { Body, Controller, Delete, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SendVerificationCodeDto } from '../../../shared/v1/dtos/send-verification-code.dto';
import { SignInWithPhoneDto } from '../../../shared/v1/dtos/sign-in-with-phone.dto';
import { AllowFor, AuthedUser, EmptyDto, GetAuthedUser, Helpers, Public, Serialize, UserType, Vendor, VendorDto, VendorSignUpDto } from '@app/common';
import { VendorAuthService } from '../services/vendor-auth.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'vendor/auth', version: '1' })
export class VendorAuthController {
  constructor(private readonly vendorAuthService: VendorAuthService) {}

  @Public()
  @Serialize(EmptyDto, 'Verification code sent successfully.')
  @Post('send-verification-code')
  sendVerificationCode(@Body() sendVerificationCodeDto: SendVerificationCodeDto): Promise<void> {
    return this.vendorAuthService.sendVerificationCode(sendVerificationCodeDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed in successfully.')
  @Post('sign-in-with-phone')
  signInWithPhone(@Body() signInWithPhoneDto: SignInWithPhoneDto): Promise<any> {
    return this.vendorAuthService.signInWithPhone(signInWithPhoneDto);
  }

  @Public()
  @Serialize(VendorDto, 'You signed up successfully.')
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('avatar'))
  signUp(
    @Body() vendorSignUpDto: VendorSignUpDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    avatar?: Express.Multer.File,
  ): Promise<Vendor> {
    return this.vendorAuthService.signUp(vendorSignUpDto, avatar);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Documents uploaded successfully.')
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload-documents')
  uploadDocuments(
    @GetAuthedUser() authedUser: AuthedUser,
    @UploadedFiles()
    files?: Express.Multer.File[],
  ): Promise<Vendor> {
    return this.vendorAuthService.uploadDocuments(authedUser.id, files);
  }

  @AllowFor(UserType.VENDOR)
  @Serialize(VendorDto, 'Account deleted successfully.')
  @Delete('delete-account')
  deleteAccount(@GetAuthedUser() authedUser: AuthedUser): Promise<Vendor> {
    return this.vendorAuthService.deleteAccount(authedUser.id);
  }
}
