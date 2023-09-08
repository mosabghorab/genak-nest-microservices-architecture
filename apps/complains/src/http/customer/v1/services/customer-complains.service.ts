import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClientUserType,
  Complain,
  FindOneOrFailByIdDto,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
  UploadFileDto,
} from '@app/common';
import { Constants } from '../../../../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { CreateComplainDto } from '../../../shared/v1/dtos/create-complain.dto';
import { ComplainCreatedEvent } from '../../../shared/v1/events/complain-created.event';

@Injectable()
export class CustomerComplainsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;

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
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
  }

  // create.
  async create(customerId: number, createComplainDto: CreateComplainDto, image?: Express.Multer.File): Promise<Complain> {
    const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id: createComplainDto.orderId,
    });
    let imageUrl: string;
    if (image) {
      imageUrl = await this.storageMicroserviceImpl.uploadFile(<UploadFileDto>{
        prefixPath: Constants.COMPLAINS_IMAGES_PREFIX_PATH,
        file: image,
      });
    }
    const savedComplain: Complain = await this.complainRepository.save(
      await this.complainRepository.create({
        complainerId: customerId,
        complainerUserType: ClientUserType.CUSTOMER,
        image: imageUrl,
        serviceType: order.serviceType,
        ...createComplainDto,
      }),
    );
    if (savedComplain) {
      this.eventEmitter.emit(Constants.COMPLAIN_CREATED_EVENT, new ComplainCreatedEvent(savedComplain));
    }
    return savedComplain;
  }
}
