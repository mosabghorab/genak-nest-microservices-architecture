import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { CreateReviewRequestDto } from '../dtos/create-review-request.dto';
import { FindAllReviewsRequestDto } from '../dtos/find-all-reviews-request.dto';
import {
  ClientUserType,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateHelpers,
  FindOneOrderOrFailByIdAndServiceTypePayloadDto,
  FindOneOrFailByIdPayloadDto,
  OrdersMicroserviceConnection,
  OrdersMicroserviceConstants,
  Review,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class VendorReviewsService {
  private readonly ordersMicroserviceConnection: OrdersMicroserviceConnection;
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;
  private readonly customersMicroserviceConnection: CustomersMicroserviceConnection;

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @Inject(OrdersMicroserviceConstants.NAME)
    private readonly ordersMicroservice: ClientProxy,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
    @Inject(CustomersMicroserviceConstants.NAME)
    private readonly customersMicroservice: ClientProxy,
  ) {
    this.ordersMicroserviceConnection = new OrdersMicroserviceConnection(ordersMicroservice, Constants.ORDERS_MICROSERVICE_VERSION);
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
    this.customersMicroserviceConnection = new CustomersMicroserviceConnection(customersMicroservice, Constants.CUSTOMERS_MICROSERVICE_VERSION);
  }

  // create.
  async create(vendorId: number, createReviewRequestDto: CreateReviewRequestDto): Promise<Review> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
      }),
    );
    await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailByIdAndServiceType(
      new FindOneOrderOrFailByIdAndServiceTypePayloadDto({
        id: createReviewRequestDto.orderId,
        serviceType: vendor.serviceType,
      }),
    );
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Customer>({
        id: createReviewRequestDto.customerId,
      }),
    );
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        vendorId,
        reviewedBy: ClientUserType.VENDOR,
        serviceType: vendor.serviceType,
        ...createReviewRequestDto,
      }),
    );
  }

  // find all.
  async findAll(vendorId: number, findAllReviewsRequestDto: FindAllReviewsRequestDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = DateHelpers.getTodayAndTomorrowForADate(findAllReviewsRequestDto.date);
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: vendorId,
      }),
    );
    return this.reviewRepository.find({
      where: {
        vendorId,
        serviceType: vendor.serviceType,
        reviewedBy: ClientUserType.VENDOR,
        order: {
          uniqueId: findAllReviewsRequestDto.orderUniqueId ? ILike(`%${findAllReviewsRequestDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsRequestDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
