import { AuthMicroserviceConstants, FindAllPushTokensPayloadDto, IPushTokensService, PushToken, RpcAuthenticationPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class PushTokensServiceImpl implements IPushTokensService {
  constructor(private readonly authMicroservice: ClientProxy, private readonly version: string) {}

  // find all.
  findAll(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<PushToken[]> {
    return firstValueFrom<PushToken[]>(
      this.authMicroservice.send<
        PushToken[],
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto;
        }
      >(
        {
          cmd: `${AuthMicroserviceConstants.PUSH_TOKENS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findAllPushTokensPayloadDto },
      ),
    );
  }
}
