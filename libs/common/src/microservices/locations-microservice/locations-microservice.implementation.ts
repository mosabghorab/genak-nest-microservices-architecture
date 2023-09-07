import { FindOneByIdDto, FindOneOrFailByIdDto, ILocationsMicroservice, Location, LocationsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class LocationsMicroserviceImpl implements ILocationsMicroservice {
  constructor(private readonly locationsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Location>): Promise<Location | null> {
    return firstValueFrom<Location>(
      this.locationsMicroservice.send<Location, FindOneByIdDto<Location>>(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Location>): Promise<Location> {
    const location: Location = await firstValueFrom<Location>(
      this.locationsMicroservice.send<Location, FindOneByIdDto<Location>>(
        {
          cmd: `${LocationsMicroserviceConstants.LOCATIONS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByIdDto<Location>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!location) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Location not found.');
    }
    return location;
  }
}
