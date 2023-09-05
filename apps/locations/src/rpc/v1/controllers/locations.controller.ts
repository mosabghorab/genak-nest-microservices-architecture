import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Location, LocationsMicroserviceConstants } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LocationsService } from '../services/locations.service';

const VERSION = '1';

@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @MessagePattern({
    cmd: `${LocationsMicroserviceConstants.MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Location>): Promise<Location | null> {
    return this.locationsService.findOneById(findOneByIdDto);
  }
}
