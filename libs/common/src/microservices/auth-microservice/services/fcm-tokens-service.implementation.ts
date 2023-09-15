import { AuthMicroserviceConstants, FcmToken, FindAllPushTokensPayloadDto, IFcmTokensService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class FcmTokensServiceImpl implements IFcmTokensService {
  constructor(private readonly authMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<FcmToken[]> {
    return firstValueFrom<FcmToken[]>(
      this.authMicroservice.send<FcmToken[], { findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto }>(
        {
          cmd: `${AuthMicroserviceConstants.FCM_TOKENS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findAllPushTokensPayloadDto },
      ),
    );
  }
}
