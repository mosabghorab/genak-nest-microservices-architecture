import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllOnBoardingScreensRequestDto } from '../dtos/find-all-on-boarding-screens-request.dto';
import { OnBoardingScreen, OrderByType } from '@app/common';

@Injectable()
export class OnBoardingScreensService {
  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
  ) {}

  // find all.
  findAll(findAllOnBoardingScreensRequestDto: FindAllOnBoardingScreensRequestDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensRequestDto.userType,
        active: true,
      },
      order: { index: OrderByType.ASC },
    });
  }
}
