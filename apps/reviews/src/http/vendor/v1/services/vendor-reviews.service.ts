import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { FindAllReviewsDto } from '../dtos/find-all-reviews.dto';
import {
  ClientUserType,
  Customer,
  CustomersMicroserviceConnection,
  CustomersMicroserviceConstants,
  DateHelpers,
  FindOneOrderOrFailByIdAndServiceTypeDto,
  FindOneOrFailByIdDto,
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
  async create(vendorId: number, createReviewDto: CreateReviewDto): Promise<Review> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    await this.ordersMicroserviceConnection.ordersServiceImpl.findOneOrFailByIdAndServiceType(<FindOneOrderOrFailByIdAndServiceTypeDto>{
      id: createReviewDto.orderId,
      serviceType: vendor.serviceType,
    });
    await this.customersMicroserviceConnection.customersServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Customer>>{
      id: createReviewDto.customerId,
    });
    return this.reviewRepository.save(
      await this.reviewRepository.create({
        vendorId,
        reviewedBy: ClientUserType.VENDOR,
        serviceType: vendor.serviceType,
        ...createReviewDto,
      }),
    );
  }

  // find all.
  async findAll(vendorId: number, findAllReviewsDto: FindAllReviewsDto): Promise<Review[]> {
    const {
      today,
      tomorrow,
    }: {
      today: Date;
      tomorrow: Date;
    } = DateHelpers.getTodayAndTomorrowForADate(findAllReviewsDto.date);
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    return this.reviewRepository.find({
      where: {
        vendorId,
        serviceType: vendor.serviceType,
        reviewedBy: ClientUserType.VENDOR,
        order: {
          uniqueId: findAllReviewsDto.orderUniqueId ? ILike(`%${findAllReviewsDto.orderUniqueId}%`) : null,
          createdAt: findAllReviewsDto.date ? Between(today, tomorrow) : null,
        },
      },
      relations: { order: true },
    });
  }
}
