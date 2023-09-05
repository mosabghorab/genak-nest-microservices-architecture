import { Controller, Get, Query } from '@nestjs/common';
import { OnBoardingScreensService } from '../services/on-boarding-screens.service';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import {
  OnBoardingScreen,
  OnBoardingScreenDto,
  Public,
  Serialize,
} from '@app/common';

@Public()
@Controller({ path: 'on-boarding-screens', version: '1' })
export class OnBoardingScreensController {
  constructor(
    private readonly onBoardingScreensService: OnBoardingScreensService,
  ) {}

  @Serialize(OnBoardingScreenDto, 'All on boarding screens.')
  @Get()
  findAll(
    @Query() findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto,
  ): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreensService.findAll(findAllOnBoardingScreensDto);
  }
}
