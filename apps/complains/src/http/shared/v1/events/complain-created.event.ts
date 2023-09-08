import { Complain } from '@app/common';

export class ComplainCreatedEvent {
  constructor(public readonly complain: Complain) {}
}
