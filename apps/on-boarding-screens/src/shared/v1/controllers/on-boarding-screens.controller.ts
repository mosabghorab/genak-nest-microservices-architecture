import { Controller, Get, Query } from '@nestjs/common';
import { OnBoardingScreensService } from '../services/on-boarding-screens.service';
import { FindAllOnBoardingScreensRequestDto } from '../dtos/find-all-on-boarding-screens-request.dto';
import { OnBoardingScreen, OnBoardingScreenResponseDto, Public, Serialize } from '@app/common';

@Public()
@Controller({ path: 'on-boarding-screens', version: '1' })
export class OnBoardingScreensController {
  constructor(private readonly onBoardingScreensService: OnBoardingScreensService) {}

  @Serialize(OnBoardingScreenResponseDto, 'All on boarding screens.')
  @Get()
  findAll(@Query() findAllOnBoardingScreensRequestDto: FindAllOnBoardingScreensRequestDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreensService.findAll(findAllOnBoardingScreensRequestDto);
  }
}
