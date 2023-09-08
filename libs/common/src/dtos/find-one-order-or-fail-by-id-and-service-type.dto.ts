import { FindOptionsRelations } from 'typeorm';
import { Order, ServiceType } from '@app/common';

export class FindOneOrderOrFailByIdAndServiceTypeDto {
  id: number;
  serviceType: ServiceType;
  failureMessage?: string;
  relations?: FindOptionsRelations<Order>;
}
