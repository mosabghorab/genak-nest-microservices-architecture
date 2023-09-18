import { Body, Controller, Get, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UpdateProfileRequestDto } from '../dtos/update-profile-request.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Helpers, Serialize, UserType, Vendor, VendorResponseDto } from '@app/common';
import { VendorProfileService } from '../services/vendor-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/profile', version: '1' })
export class VendorProfileController {
  constructor(private readonly vendorProfileService: VendorProfileService) {}

  @Serialize(VendorResponseDto, 'Profile updated successfully.')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch()
  update(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    avatar?: Express.Multer.File,
  ): Promise<Vendor> {
    return this.vendorProfileService.update(authedUser, updateProfileRequestDto, avatar);
  }

  @Serialize(VendorResponseDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Vendor> {
    return this.vendorProfileService.find(authedUser);
  }
}
