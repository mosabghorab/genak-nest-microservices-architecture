import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { OnBoardingScreen, OrderByType } from '@app/common';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find all.
  findAll(
    findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto,
  ): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
        active: true,
      },
      order: { index: OrderByType.ASC },
    });
  }
}
