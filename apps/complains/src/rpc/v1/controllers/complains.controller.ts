import { Controller } from '@nestjs/common';
import { Complain, ComplainsMicroserviceConstants, FindOneByIdPayloadDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ComplainsService } from '../services/complains.service';

const VERSION = '1';

@Controller()
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @MessagePattern({
    cmd: `${ComplainsMicroserviceConstants.COMPLAINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null> {
    return this.complainsService.findOneById(findOneByIdPayloadDto);
  }
}
