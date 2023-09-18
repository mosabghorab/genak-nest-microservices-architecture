import { FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, IReasonsService, Reason, ReasonsMicroserviceConstants, RpcAuthenticationPayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ReasonsServiceImpl implements IReasonsService {
  constructor(private readonly reasonsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>): Promise<Reason | null> {
    return firstValueFrom<Reason>(
      this.reasonsMicroservice.send<
        Reason,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>;
        }
      >(
        {
          cmd: `${ReasonsMicroserviceConstants.REASONS_SERVICE_MICROSERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Reason>): Promise<Reason> {
    const reason: Reason = await this.findOneById(
      rpcAuthenticationPayloadDto,
      new FindOneByIdPayloadDto<Reason>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!reason) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Reason not found.');
    }
    return reason;
  }
}
