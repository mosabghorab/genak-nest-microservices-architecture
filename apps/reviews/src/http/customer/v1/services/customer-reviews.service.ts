import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import {
  ClientUserType,
  DateHelpers,
  FindOneOrFailByIdDto,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  Review,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { CreateReviewDto } from '../dtos/create-review.dto';

@Injectable()
export class CustomerReviewsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // create.
  async create(customerId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Order>>{
      id: createReviewDto.orderId,
    });
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: createReviewDto.vendorId,
    });
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        customerId,
        reviewedBy: ClientUserType.CUSTOMER,
        serviceType: order.serviceType,
        ...createReviewDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number, findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = DateHelpers.getTodayAndTomorrowForADate(findAllReviewsDto.date);
    return this.reviewRepository.find({
      where: {
        customerId,
        serviceType: findAllReviewsDto.serviceType,
        reviewedBy: ClientUserType.CUSTOMER,
        order: {
          uniqueId: findAllReviewsDto.orderUniqueId ? ILike(`%${findAllReviewsDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
