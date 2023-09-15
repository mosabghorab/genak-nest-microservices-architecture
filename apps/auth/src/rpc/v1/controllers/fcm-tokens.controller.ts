import { Controller } from '@nestjs/common';
import { AuthMicroserviceConstants, FcmToken, FindAllPushTokensPayloadDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FcmTokensService } from '../services/fcm-tokens.service';

const VERSION = '1';

@Controller()
export class FcmTokensController {
  constructor(private readonly fcmTokensService: FcmTokensService) {}

  @MessagePattern({
    cmd: `${AuthMicroserviceConstants.FCM_TOKENS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAll(@Payload('findAllPushTokensPayloadDto') findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<FcmToken[]> {
    return this.fcmTokensService.findAll(findAllPushTokensPayloadDto);
  }
}
