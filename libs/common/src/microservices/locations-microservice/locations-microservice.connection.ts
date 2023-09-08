import { LocationsServiceImpl } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

export class LocationsMicroserviceConnection {
  public readonly locationsServiceImpl: LocationsServiceImpl;

  constructor(private readonly locationsMicroservice: ClientProxy, private readonly version: string) {
    this.locationsServiceImpl = new LocationsServiceImpl(locationsMicroservice, version);
  }
}
