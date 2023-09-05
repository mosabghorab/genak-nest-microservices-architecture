import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/browser';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteFileDto, OnBoardingScreen, OrderByType, StorageMicroserviceConstants, StorageMicroserviceImpl, UploadFileDto } from '@app/common';
import { FindAllOnBoardingScreensDto } from '../dtos/find-all-on-boarding-screens.dto';
import { CreateOnBoardingScreenDto } from '../dtos/create-on-boarding-screen.dto';
import { UpdateOnBoardingScreenDto } from '../dtos/update-on-boarding-screen.dto';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminOnBoardingScreensService {
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
    @Inject(StorageMicroserviceConstants.MICROSERVICE_NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(id: number, relations?: FindOptionsRelations<OnBoardingScreen>): Promise<OnBoardingScreen | null> {
    return this.onBoardingScreenRepository.findOne({
      where: { id },
      relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string, relations?: FindOptionsRelations<OnBoardingScreen>): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneById(id, relations);
    if (!onBoardingScreen) {
      throw new NotFoundException(failureMessage || 'On boarding screen not found.');
    }
    return onBoardingScreen;
  }

  // find all.
  findAll(findAllOnBoardingScreensDto: FindAllOnBoardingScreensDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensDto.userType,
      },
      order: { index: OrderByType.ASC },
    });
  }

  // create.
  async create(createOnBoardingScreenDto: CreateOnBoardingScreenDto, image: Express.Multer.File): Promise<OnBoardingScreen> {
    const imageUrl: string = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
      prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
      file: image,
    });
    return this.onBoardingScreenRepository.save(
      await this.onBoardingScreenRepository.create({
        image: imageUrl,
        ...createOnBoardingScreenDto,
      }),
    );
  }

  // update.
  async update(id: number, updateOnBoardingScreenDto: UpdateOnBoardingScreenDto, image?: Express.Multer.File): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(id);
    if (image) {
      await this.storageMicroserviceImpl.deleteFile(<DeleteFileDto>{
        prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
        fileUrl: onBoardingScreen.image,
      });
      onBoardingScreen.image = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
        file: image,
      });
    }
    Object.assign(onBoardingScreen, updateOnBoardingScreenDto);
    return this.onBoardingScreenRepository.save(onBoardingScreen);
  }

  // remove.
  async remove(id: number): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(id);
    return this.onBoardingScreenRepository.remove(onBoardingScreen);
  }
}
