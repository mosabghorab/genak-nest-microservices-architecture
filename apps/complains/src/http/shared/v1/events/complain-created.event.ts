import { AuthedUser, Complain } from '@app/common';

export class ComplainCreatedEvent {
  constructor(public readonly authedUser: AuthedUser, public readonly complain: Complain) {}
}
