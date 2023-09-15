import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeleteFilePayloadDto,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  OnBoardingScreen,
  OrderByType,
  StorageMicroserviceConnection,
  StorageMicroserviceConstants,
  UploadFilePayloadDto,
} from '@app/common';
import { FindAllOnBoardingScreensRequestDto } from '../dtos/find-all-on-boarding-screens-request.dto';
import { CreateOnBoardingScreenRequestDto } from '../dtos/create-on-boarding-screen-request.dto';
import { UpdateOnBoardingScreenRequestDto } from '../dtos/update-on-boarding-screen-request.dto';
import { Constants } from '../../../constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AdminOnBoardingScreensService {
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    @InjectRepository(OnBoardingScreen)
    private readonly onBoardingScreenRepository: Repository<OnBoardingScreen>,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<OnBoardingScreen>): Promise<OnBoardingScreen | null> {
    return this.onBoardingScreenRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<OnBoardingScreen>): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneById(
      new FindOneByIdPayloadDto<OnBoardingScreen>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!onBoardingScreen) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'On boarding screen not found.');
    }
    return onBoardingScreen;
  }

  // find all.
  findAll(findAllOnBoardingScreensRequestDto: FindAllOnBoardingScreensRequestDto): Promise<OnBoardingScreen[]> {
    return this.onBoardingScreenRepository.find({
      where: {
        userType: findAllOnBoardingScreensRequestDto.userType,
      },
      order: { index: OrderByType.ASC },
    });
  }

  // create.
  async create(createOnBoardingScreenRequestDto: CreateOnBoardingScreenRequestDto, image: Express.Multer.File): Promise<OnBoardingScreen> {
    const imageUrl: string = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
      new UploadFilePayloadDto({
        prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
        file: image,
      }),
    );
    return this.onBoardingScreenRepository.save(
      await this.onBoardingScreenRepository.create({
        image: imageUrl,
        ...createOnBoardingScreenRequestDto,
      }),
    );
  }

  // update.
  async update(id: number, updateOnBoardingScreenRequestDto: UpdateOnBoardingScreenRequestDto, image?: Express.Multer.File): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<OnBoardingScreen>({
        id,
      }),
    );
    if (image) {
      await this.storageMicroserviceConnection.storageServiceImpl.deleteFile(
        new DeleteFilePayloadDto({
          prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
          fileUrl: onBoardingScreen.image,
        }),
      );
      onBoardingScreen.image = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new UploadFilePayloadDto({
          prefixPath: Constants.ON_BOARDING_SCREENS_IMAGES_PREFIX_PATH,
          file: image,
        }),
      );
    }
    Object.assign(onBoardingScreen, updateOnBoardingScreenRequestDto);
    return this.onBoardingScreenRepository.save(onBoardingScreen);
  }

  // remove.
  async remove(id: number): Promise<OnBoardingScreen> {
    const onBoardingScreen: OnBoardingScreen = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<OnBoardingScreen>({
        id,
      }),
    );
    return this.onBoardingScreenRepository.remove(onBoardingScreen);
  }
}
