import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  AuthedUser,
  FindOneOrFailByIdPayloadDto,
  GetAuthedUser,
  Helpers,
  OnBoardingScreen,
  OnBoardingScreenResponseDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Serialize,
  UserType,
} from '@app/common';
import { AdminOnBoardingScreensService } from '../services/admin-on-boarding-screens.service';
import { CreateOnBoardingScreenRequestDto } from '../dtos/create-on-boarding-screen-request.dto';
import { FindAllOnBoardingScreensRequestDto } from '../dtos/find-all-on-boarding-screens-request.dto';
import { UpdateOnBoardingScreenRequestDto } from '../dtos/update-on-boarding-screen-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ON_BOARDING_SCREENS)
@Controller({ path: 'admin/on-boarding-screens', version: '1' })
export class AdminOnBoardingScreensController {
  constructor(private readonly adminOnBoardingScreensService: AdminOnBoardingScreensService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(OnBoardingScreenResponseDto, 'On boarding screen created successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @GetAuthedUser() authedUser: AuthedUser,
    @Body() createOnBoardingScreenRequestDto: CreateOnBoardingScreenRequestDto,
    @UploadedFile(Helpers.defaultImageValidator()) image: Express.Multer.File,
  ): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.create(authedUser, createOnBoardingScreenRequestDto, image);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenResponseDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensRequestDto: FindAllOnBoardingScreensRequestDto): Promise<OnBoardingScreen[]> {
    return this.adminOnBoardingScreensService.findAll(findAllOnBoardingScreensRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(OnBoardingScreenResponseDto, 'One on boarding screen.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<OnBoardingScreen>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(OnBoardingScreenResponseDto, 'On boarding screen updated successfully.')
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  update(
    @GetAuthedUser() authedUser: AuthedUser,
    @Param('id') id: number,
    @Body() updateOnBoardingScreenRequestDto: UpdateOnBoardingScreenRequestDto,
    @UploadedFile(Helpers.defaultImageValidator(false)) image?: Express.Multer.File,
  ): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.update(authedUser, id, updateOnBoardingScreenRequestDto, image);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(OnBoardingScreenResponseDto, 'On boarding screen deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<OnBoardingScreen> {
    return this.adminOnBoardingScreensService.remove(id);
  }
}
