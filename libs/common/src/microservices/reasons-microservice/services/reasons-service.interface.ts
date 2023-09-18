import { FindOneByIdPayloadDto, Reason, RpcAuthenticationPayloadDto } from '@app/common';

export interface IReasonsService {
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>): Promise<Reason | null>;
}
