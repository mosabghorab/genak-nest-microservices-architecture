import { FcmTokensServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class AuthMicroserviceConnection {
  public readonly fcmTokensServiceImpl: FcmTokensServiceImpl;

  constructor(private readonly authMicroservice: ClientProxy, private readonly version: string) {
    this.fcmTokensServiceImpl = new FcmTokensServiceImpl(authMicroservice, version);
  }
}
