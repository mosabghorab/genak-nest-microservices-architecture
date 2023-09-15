import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AllowFor, AuthedUser, Complain, ComplainResponseDto, GetAuthedUser, Helpers, Serialize, UserType } from '@app/common';
import { VendorComplainsService } from '../services/vendor-complains.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateComplainRequestDto } from '../../../shared/v1/dtos/create-complain-request.dto';

@AllowFor(UserType.VENDOR)
@Controller({ path: 'vendor/complains', version: '1' })
export class VendorComplainsController {
  constructor(private readonly vendorComplainsService: VendorComplainsService) {}

  @Serialize(ComplainResponseDto, 'Complain created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createComplainRequestDto: CreateComplainRequestDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    image?: Express.Multer.File,
  ): Promise<Complain> {
    return this.vendorComplainsService.create(authedUser.id, createComplainRequestDto, image);
  }
}
