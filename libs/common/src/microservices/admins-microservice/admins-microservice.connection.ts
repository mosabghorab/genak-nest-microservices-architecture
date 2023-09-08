import { AdminsServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class AdminsMicroserviceConnection {
  public readonly adminsServiceImpl: AdminsServiceImpl;

  constructor(private readonly adminsMicroservice: ClientProxy, private readonly version: string) {
    this.adminsServiceImpl = new AdminsServiceImpl(adminsMicroservice, version);
  }
}
