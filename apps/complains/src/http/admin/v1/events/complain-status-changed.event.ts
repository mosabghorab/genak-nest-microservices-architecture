import { AuthedUser, Complain } from '@app/common';

export class ComplainStatusChangedEvent {
  constructor(public readonly authedUser: AuthedUser, public readonly complain: Complain) {}
}
