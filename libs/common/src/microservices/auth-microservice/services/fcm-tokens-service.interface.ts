import { FcmToken, FindAllFcmTokensDto } from '@app/common';

export interface IFcmTokensService {
  findAll(findAllFcmTokensDto: FindAllFcmTokensDto): Promise<FcmToken[]>;
}
