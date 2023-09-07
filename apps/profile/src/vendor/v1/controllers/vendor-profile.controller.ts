import { Body, Controller, Get, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { AllowFor, AuthedUser, GetAuthedUser, Helpers, Serialize, UserType, Vendor, VendorDto } from '@app/common';
import { VendorProfileService } from '../services/vendor-profile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/profile', version: '1' })
export class VendorProfileController {
  constructor(private readonly vendorProfileService: VendorProfileService) {}

  @Serialize(VendorDto, 'Profile updated successfully.')
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch()
  update(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    avatar?: Express.Multer.File,
  ): Promise<Vendor> {
    return this.vendorProfileService.update(authedUser.id, updateProfileDto, avatar);
  }

  @Serialize(VendorDto, 'Profile retrieved successfully.')
  @Get()
  find(@GetAuthedUser() authedUser: AuthedUser): Promise<Vendor> {
    return this.vendorProfileService.find(authedUser.id);
  }
}
