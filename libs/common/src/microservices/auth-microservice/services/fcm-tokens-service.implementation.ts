import { AuthMicroserviceConstants, FcmToken, FindAllFcmTokensDto, IFcmTokensService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class FcmTokensServiceImpl implements IFcmTokensService {
  constructor(private readonly authMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(findAllFcmTokensDto: FindAllFcmTokensDto): Promise<FcmToken[]> {
    return firstValueFrom<FcmToken[]>(
      this.authMicroservice.send<FcmToken[], FindAllFcmTokensDto>(
        {
          cmd: `${AuthMicroserviceConstants.FCM_TOKENS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        findAllFcmTokensDto,
      ),
    );
  }
}
