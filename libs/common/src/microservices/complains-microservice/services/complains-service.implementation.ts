import { Complain, ComplainsMicroserviceConstants, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, IComplainsService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ComplainsServiceImpl implements IComplainsService {
  constructor(private readonly complainsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null> {
    return firstValueFrom<Complain>(
      this.complainsMicroservice.send<Complain, { findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain> }>(
        {
          cmd: `${ComplainsMicroserviceConstants.COMPLAINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        { findOneByIdPayloadDto },
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Complain>): Promise<Complain> {
    const complain: Complain = await this.findOneById(
      new FindOneByIdPayloadDto<Complain>({
        id: findOneOrFailByIdPayloadDto.id,
        relations: findOneOrFailByIdPayloadDto.relations,
      }),
    );
    if (!complain) {
      throw new NotFoundException(findOneOrFailByIdPayloadDto.failureMessage || 'Complain not found.');
    }
    return complain;
  }
}
