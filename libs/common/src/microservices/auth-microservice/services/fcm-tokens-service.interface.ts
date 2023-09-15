import { FcmToken, FindAllPushTokensPayloadDto } from '@app/common';

export interface IFcmTokensService {
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<FcmToken[]>;
}
