import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';
import {
  AuthedUser,
  ClientUserType,
  DateHelpers,
  FindOneOrFailByIdPayloadDto,
  Order,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  Review,
  RpcAuthenticationPayloadDto,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';
import { CreateReviewRequestDto } from '../dtos/create-review-request.dto';

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
  async create(authedUser: AuthedUser, createReviewRequestDto: CreateReviewRequestDto): Promise<Review> {
    const order: Order = await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Order>({
        id: createReviewRequestDto.orderId,
      }),
    );
    await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: createReviewRequestDto.vendorId,
      }),
    );
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        customerId: authedUser.id,
        reviewedBy: ClientUserType.CUSTOMER,
        serviceType: order.serviceType,
        ...createReviewRequestDto,
      }),
    );
  }

  // find all.
  findAll(customerId: number, findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = DateHelpers.getTodayAndTomorrowForADate(findAllReviewsRequestDto.date);
    return this.reviewRepository.find({
      where: {
        customerId,
        serviceType: findAllReviewsRequestDto.serviceType,
        reviewedBy: ClientUserType.CUSTOMER,
        order: {
          uniqueId: findAllReviewsRequestDto.orderUniqueId ? ILike(`%${findAllReviewsRequestDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsRequestDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
