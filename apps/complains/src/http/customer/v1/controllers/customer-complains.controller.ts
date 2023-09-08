import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateComplainDto } from '../../../shared/v1/dtos/create-complain.dto';
import { AllowFor, AuthedUser, Complain, ComplainDto, GetAuthedUser, Helpers, Serialize, UserType } from '@app/common';
import { CustomerComplainsService } from '../services/customer-complains.service';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.CUSTOMER)
@Controller({ path: 'customer/complains', version: '1' })
export class CustomerComplainsController {
  constructor(private readonly customerComplainsService: CustomerComplainsService) {}

  @Serialize(ComplainDto, 'Complain created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createComplainDto: CreateComplainDto,
    @UploadedFile(Helpers.defaultImageValidator(false))
    image?: Express.Multer.File,
  ): Promise<Complain> {
    return this.customerComplainsService.create(authedUser.id, createComplainDto, image);
  }
}
