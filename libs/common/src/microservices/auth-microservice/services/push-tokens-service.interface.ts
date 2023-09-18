import { FindAllPushTokensPayloadDto, PushToken, RpcAuthenticationPayloadDto } from '@app/common';

export interface IPushTokensService {
  findAll(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<PushToken[]>;
}
