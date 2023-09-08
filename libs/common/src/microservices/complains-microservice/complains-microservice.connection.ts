import { ClientProxy } from '@nestjs/microservices';
import { ComplainsServiceImpl } from '@app/common/microservices';

export class ComplainsMicroserviceConnection {
  public readonly complainsServiceImpl: ComplainsServiceImpl;

  constructor(private readonly complainsMicroservice: ClientProxy, private readonly version: string) {
    this.complainsServiceImpl = new ComplainsServiceImpl(complainsMicroservice, version);
  }
}
