import { FindOneByIdDto, FindOneOrFailByIdDto, IReasonsService, Reason, ReasonsMicroserviceConstants } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ReasonsServiceImpl implements IReasonsService {
  constructor(private readonly reasonsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Reason>): Promise<Reason | null> {
    return firstValueFrom<Reason>(
      this.reasonsMicroservice.send<Reason, FindOneByIdDto<Reason>>(
        {
          cmd: `${ReasonsMicroserviceConstants.REASONS_SERVICE_MICROSERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Reason>): Promise<Reason> {
    const reason: Reason = await firstValueFrom<Reason>(
      this.reasonsMicroservice.send<Reason, FindOneByIdDto<Reason>>(
        {
          cmd: `${ReasonsMicroserviceConstants.REASONS_SERVICE_MICROSERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        <FindOneByIdDto<Reason>>{
          id: findOneOrFailByIdDto.id,
          relations: findOneOrFailByIdDto.relations,
        },
      ),
    );
    if (!reason) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Reason not found.');
    }
    return reason;
  }
}
