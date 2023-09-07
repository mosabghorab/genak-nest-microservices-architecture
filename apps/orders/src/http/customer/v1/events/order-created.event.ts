import { Customer, Order, Vendor } from '@app/common';

export class OrderCreatedEvent {
  constructor(public readonly order: Order, public readonly vendor: Vendor, public readonly customer: Customer) {}
}
