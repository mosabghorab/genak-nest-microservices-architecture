import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AuthedUser,
  FindOneByIdPayloadDto,
  FindOneOrFailByIdPayloadDto,
  Order,
  OrderStatus,
  RpcAuthenticationPayloadDto,
  Vendor,
  VendorsMicroserviceConnection,
  VendorsMicroserviceConstants,
} from '@app/common';
import { FindAllOrdersRequestDto } from '../dtos/find-all-orders-request.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class VendorOrdersService {
  private readonly vendorsMicroserviceConnection: VendorsMicroserviceConnection;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.vendorsMicroserviceConnection = new VendorsMicroserviceConnection(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(
      new FindOneByIdPayloadDto<Order>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!order) {
      throw new BadRequestException(findOneOrFailByIdPayloadDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(authedUser: AuthedUser, findAllOrdersRequestDto: FindAllOrdersRequestDto): Promise<Order[]> {
    const vendor: Vendor = await this.vendorsMicroserviceConnection.vendorsServiceImpl.findOneOrFailById(
      new RpcAuthenticationPayloadDto({ authentication: authedUser.authentication }),
      new FindOneOrFailByIdPayloadDto<Vendor>({
        id: authedUser.id,
      }),
    );
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.customerAddress', 'customerAddress')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.orderStatusHistories', 'orderStatusHistory')
      .where('order.vendorId = :vendorId', { vendorId: authedUser.id })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: vendor.serviceType,
      })
      .andWhere('order.status IN (:...statuses)', {
        statuses: findAllOrdersRequestDto.statuses,
      })
      .addOrderBy(
        'CASE order.status ' +
          findAllOrdersRequestDto.statuses.map((status: OrderStatus, index: number): string => `WHEN '${status}' THEN ${index} `).join('') +
          'ELSE ' +
          (findAllOrdersRequestDto.statuses.length + 1) +
          ' END',
      )
      .getMany();
  }
}
