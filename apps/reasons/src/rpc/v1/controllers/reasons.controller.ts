import { Controller } from '@nestjs/common';
import { FindOneByIdDto, Reason, ReasonsMicroserviceConstants } from '@app/common';
import { ReasonsService } from '../services/reasons.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@Controller()
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @MessagePattern({
    cmd: `${ReasonsMicroserviceConstants.REASONS_SERVICE_MICROSERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload() findOneByIdDto: FindOneByIdDto<Reason>): Promise<Reason | null> {
    return this.reasonsService.findOneById(findOneByIdDto);
  }
}
