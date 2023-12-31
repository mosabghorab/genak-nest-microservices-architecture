import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, FindOneByIdPayloadDto, Reason, ReasonsMicroserviceConstants, SkipAdminRoles, UserType } from '@app/common';
import { ReasonsService } from '../services/reasons.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @AllowFor(UserType.ADMIN, UserType.CUSTOMER, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${ReasonsMicroserviceConstants.REASONS_SERVICE_MICROSERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findOneById(@Payload('findOneByIdPayloadDto') findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>): Promise<Reason | null> {
    return this.reasonsService.findOneById(findOneByIdPayloadDto);
  }
}
