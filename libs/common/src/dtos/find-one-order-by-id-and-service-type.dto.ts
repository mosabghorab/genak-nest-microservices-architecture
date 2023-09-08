import { FindOptionsRelations } from 'typeorm';
import { Order, ServiceType } from '@app/common';

export class FindOneOrderByIdAndServiceTypeDto {
  id: number;
  serviceType: ServiceType;
  relations?: FindOptionsRelations<Order>;
}
