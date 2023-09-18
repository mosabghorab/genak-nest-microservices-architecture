import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, Complain, ComplainsMicroserviceConstants, FindOneByIdPayloadDto, SkipAdminRoles, UserType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ComplainsService } from '../services/complains.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class ComplainsController {
  constructor(private readonly complainsService: ComplainsService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${ComplainsMicroserviceConstants.COMPLAINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null> {
    return this.complainsService.findOneById(findOneByIdPayloadDto);
  }
}
