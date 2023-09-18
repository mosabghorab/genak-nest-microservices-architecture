import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthedUser,
  ClientUserType,
  Complain,
  FindOneOrFailByIdPayloadDto,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  RpcAuthenticationPayloadDto,
  StorageMicroserviceConnection,
  StorageMicroserviceConstants,
  UploadFilePayloadDto,
} from '@app/common';
import { Constants } from '../../../../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { CreateComplainRequestDto } from '../../../shared/v1/dtos/create-complain-request.dto';
import { ComplainCreatedEvent } from '../../../shared/v1/events/complain-created.event';

@Injectable()
export class CustomerComplainsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly storageMicroserviceConnection: StorageMicroserviceConnection;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
  ) {
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.storageMicroserviceConnection = new StorageMicroserviceConnection(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // create.
  async create(authedUser: AuthedUser, createComplainRequestDto: CreateComplainRequestDto, image?: Express.Multer.File): Promise<Complain> {
    const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Order>({
        id: createComplainRequestDto.orderId,
      }),
    );
    let imageUrl: string;
    if (image) {
      imageUrl = await this.storageMicroserviceConnection.storageServiceImpl.uploadFile(
        new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
        new UploadFilePayloadDto({
          prefixPath: Constants.COMPLAINS_IMAGES_PREFIX_PATH,
          file: image,
        }),
      );
    }
    const savedComplain: Complain = await this.complainRepository.save(
      await this.complainRepository.create({
        complainerId: authedUser.id,
        complainerUserType: ClientUserType.CUSTOMER,
        image: imageUrl,
        serviceType: order.serviceType,
        ...createComplainRequestDto,
      }),
    );
    if (savedComplain) {
      this.eventEmitter.emit(Constants.COMPLAIN_CREATED_EVENT, new ComplainCreatedEvent(authedUser, savedComplain));
    }
    return savedComplain;
  }
}
