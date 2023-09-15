import { FindOptionsRelations } from 'typeorm';
import { Order, ServiceType } from '@app/common';

export class FindOneOrderByIdAndServiceTypePayloadDto {
  id: number;
  serviceType: ServiceType;
  relations?: FindOptionsRelations<Order>;

  constructor(data: { id: number; serviceType: ServiceType; relations?: FindOptionsRelations<Order> }) {
    Object.assign(this, data);
  }
}
