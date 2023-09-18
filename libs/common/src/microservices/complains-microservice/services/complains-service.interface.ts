import { Complain, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, RpcAuthenticationPayloadDto } from '@app/common';

export interface IComplainsService {
  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null>;

  // find one or fail by id.
  findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Complain>): Promise<Complain>;
}
