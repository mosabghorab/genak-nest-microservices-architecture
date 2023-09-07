import { FindOneByIdDto, Order } from '@app/common';

export interface IOrdersService {
  findOneById(findOneByIdDto: FindOneByIdDto<Order>): Promise<Order | null>;
}
