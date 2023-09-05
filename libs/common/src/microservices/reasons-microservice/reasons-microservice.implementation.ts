import { ClientProxy } from '@nestjs/microservices';
import { IReasonsMicroservice } from '@app/common';

export class ReasonsMicroserviceImpl implements IReasonsMicroservice {
  constructor(private readonly reasonsMicroservice: ClientProxy, private readonly version: string) {}
}
