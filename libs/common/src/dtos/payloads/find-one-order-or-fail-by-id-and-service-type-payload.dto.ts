import { FindOptionsRelations } from 'typeorm';
import { Order, ServiceType } from '@app/common';

export class FindOneOrderOrFailByIdAndServiceTypePayloadDto {
  id: number;
  serviceType: ServiceType;
  failureMessage?: string;
  relations?: FindOptionsRelations<Order>;

  constructor(data: { id: number; serviceType: ServiceType; failureMessage?: string; relations?: FindOptionsRelations<Order> }) {
    Object.assign(this, data);
  }
}
