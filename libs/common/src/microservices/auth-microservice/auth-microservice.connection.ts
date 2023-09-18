import { PushTokensServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class AuthMicroserviceConnection {
  public readonly pushTokensServiceImpl: PushTokensServiceImpl;

  constructor(private readonly authMicroservice: ClientProxy, private readonly version: string) {
    this.pushTokensServiceImpl = new PushTokensServiceImpl(authMicroservice, version);
  }
}
