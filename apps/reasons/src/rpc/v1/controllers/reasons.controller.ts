import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Microservices, Reason } from '@app/common';
import { ReasonsService } from '../services/reasons.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @MessagePattern({
    cmd: `${Microservices.REASONS_MICROSERVICE_FUNCTION_FIND_ONE_BY_ID}/v${VERSION}`,
  })
  findOneById(
    @Payload() findOneByIdDto: FindOneByIdDto<Reason>,
  ): Promise<Reason | null> {
    return this.reasonsService.findOneById(findOneByIdDto);
  }
}
