import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClientUserType,
  Complain,
  FindOneOrderOrFailByIdAndServiceTypeDto,
  FindOneOrFailByIdDto,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  StorageMicroserviceConstants,
  StorageMicroserviceImpl,
  UploadFileDto,
  Vendor,
  VendorsMicroserviceConstants,
  VendorsMicroserviceImpl,
} from '@app/common';
import { Constants } from '../../../../constants';
import { ClientProxy } from '@nestjs/microservices';
import { ComplainCreatedEvent } from '../../../shared/v1/events/complain-created.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateComplainDto } from '../../../shared/v1/dtos/create-complain.dto';

@Injectable()
export class VendorComplainsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly storageMicroserviceImpl: StorageMicroserviceImpl;
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(StorageMicroserviceConstants.NAME)
    private readonly storageMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.storageMicroserviceImpl = new StorageMicroserviceImpl(storageMicroservice, Constants.STORAGE_MICROSERVICE_VERSION);
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // create.
  async create(vendorId: number, createComplainDto: CreateComplainDto, image?: Express.Multer.File): Promise<Complain> {
    const vendor: Vendor = await this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailByIdAndServiceType(<FindOneOrderOrFailByIdAndServiceTypeDto>{
      id: createComplainDto.orderId,
      serviceType: vendor.serviceType,
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
        complainerId: vendorId,
        complainerUserType: ClientUserType.VENDOR,
        serviceType: vendor.serviceType,
        image: imageUrl,
        ...createComplainDto,
      }),
    );
    if (savedComplain) {
      this.eventEmitter.emit(Constants.COMPLAIN_CREATED_EVENT, new ComplainCreatedEvent(savedComplain));
    }
    return savedComplain;
  }
}
