import { AuthedUser, Order } from '@app/common';

export class OrderStatusChangedEvent {
  constructor(public readonly authedUser: AuthedUser, public readonly order: Order) {}
}
