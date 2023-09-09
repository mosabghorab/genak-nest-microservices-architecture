import { StorageServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class StorageMicroserviceConnection {
  public readonly storageServiceImpl: StorageServiceImpl;

  constructor(private readonly storageMicroservice: ClientProxy, private readonly version: string) {
    this.storageServiceImpl = new StorageServiceImpl(storageMicroservice, version);
  }
}
