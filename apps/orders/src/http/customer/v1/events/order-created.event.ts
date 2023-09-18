import { AuthedUser, Customer, Order, Vendor } from '@app/common';

export class OrderCreatedEvent {
  constructor(public readonly authedUser: AuthedUser, public readonly order: Order, public readonly vendor: Vendor, public readonly customer: Customer) {}
}
