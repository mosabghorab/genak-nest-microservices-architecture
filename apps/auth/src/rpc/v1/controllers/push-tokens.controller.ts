import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, AuthMicroserviceConstants, FindAllPushTokensPayloadDto, PushToken, SkipAdminRoles, UserType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PushTokensService } from '../services/push-tokens.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class PushTokensController {
  constructor(private readonly fcmTokensService: PushTokensService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR, UserType.CUSTOMER)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${AuthMicroserviceConstants.PUSH_TOKENS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAll(@Payload('findAllPushTokensPayloadDto') findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<PushToken[]> {
    return this.fcmTokensService.findAll(findAllPushTokensPayloadDto);
  }
}
