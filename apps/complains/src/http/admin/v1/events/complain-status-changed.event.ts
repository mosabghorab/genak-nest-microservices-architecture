import { Complain } from '@app/common';

export class ComplainStatusChangedEvent {
  constructor(public readonly complain: Complain) {}
}
