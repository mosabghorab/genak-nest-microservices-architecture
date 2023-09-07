import { ClientProxy } from '@nestjs/microservices';
import { ReasonsServiceImpl } from '@app/common/microservices';

export class ReasonsMicroserviceConnection {
  public readonly reasonsServiceImpl: ReasonsServiceImpl;

  constructor(private readonly reasonsMicroservice: ClientProxy, private readonly version: string) {
    this.reasonsServiceImpl = new ReasonsServiceImpl(reasonsMicroservice, version);
  }
}
