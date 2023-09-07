import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneByIdDto, FindOneOrFailByIdDto, Order, Vendor, VendorsMicroserviceConstants, VendorsMicroserviceImpl } from '@app/common';
import { FindAllOrdersDto } from '../dtos/find-all-orders.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Constants } from '../../../../constants';

@Injectable()
export class VendorOrdersService {
  private readonly vendorsMicroserviceImpl: VendorsMicroserviceImpl;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(VendorsMicroserviceConstants.NAME)
    private readonly vendorsMicroservice: ClientProxy,
  ) {
    this.vendorsMicroserviceImpl = new VendorsMicroserviceImpl(vendorsMicroservice, Constants.VENDORS_MICROSERVICE_VERSION);
  }

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id: findOneByIdDto.id }, relations: findOneByIdDto.relations });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Order>): Promise<Order> {
    const order: Order = await this.findOneById(<FindOneByIdDto<Order>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!order) {
      throw new BadRequestException(findOneOrFailByIdDto.failureMessage || 'Order not found.');
    }
    return order;
  }

  // find all.
  async findAll(vendorId: number, findAllOrdersDto: FindAllOrdersDto): Promise<Order[]> {
    const vendor: Vendor = await this.vendorsMicroserviceImpl.findOneOrFailById(<FindOneOrFailByIdDto<Vendor>>{
      id: vendorId,
    });
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.customerAddress', 'customerAddress')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('order.orderStatusHistories', 'orderStatusHistory')
      .where('order.vendorId = :vendorId', { vendorId })
      .andWhere('order.serviceType = :serviceType', {
        serviceType: vendor.serviceType,
      })
      .andWhere('order.status IN (:...statuses)', {
        statuses: findAllOrdersDto.statuses,
      })
      .addOrderBy('CASE order.status ' + findAllOrdersDto.statuses.map((status, index) => `WHEN '${status}' THEN ${index} `).join('') + 'ELSE ' + (findAllOrdersDto.statuses.length + 1) + ' END')
      .getMany();
  }
}
