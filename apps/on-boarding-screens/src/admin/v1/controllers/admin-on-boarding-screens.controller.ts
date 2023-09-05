import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, Helpers, OnBoardingScreen, OnBoardingScreenDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminOnBoardingScreensService } from '../services/admin-on-boarding-screens.service';
import { CreateOnBoardingScreenDto } from '../dtos/create-on-boarding-screen.dto';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/update-on-boarding-screen.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ON_BOARDING_SCREENS)
@Controller({ path: 'admin/on-boarding-screens', version: '1' })
export class AdminOnBoardingScreensController {
  constructor(private readonly adminOnBoardingScreensService: AdminOnBoardingScreensService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(@Body() createOnBoardingScreenDto: CreateOnBoardingScreenDto, @UploadedFile(Helpers.defaultImageValidator()) image: Express.Multer.File): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.create(createOnBoardingScreenDto, image);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto): Promise<OnBoardingScreen[]> {
    return this.adminOnBoardingScreensService.findAll(findAllOnBoardingScreensDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenDto, 'One on boarding screen.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen updated successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOnBoardingScreenDto: UpdateOnBoardingScreenDto,
    @UploadedFile(Helpers.defaultImageValidator(false)) image?: Express.Multer.File,
  ): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.update(id, updateOnBoardingScreenDto, image);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OnBoardingScreenDto, 'On boarding screen deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.remove(id);
  }
}
