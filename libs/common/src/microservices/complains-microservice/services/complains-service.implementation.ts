import { Complain, ComplainsMicroserviceConstants, FindOneByIdDto, FindOneOrFailByIdDto, IComplainsService } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

export class ComplainsServiceImpl implements IComplainsService {
  constructor(private readonly complainsMicroservice: ClientProxy, private readonly version: string) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Complain>): Promise<Complain | null> {
    return firstValueFrom<Complain>(
      this.complainsMicroservice.send<Complain, FindOneByIdDto<Complain>>(
        {
          cmd: `${ComplainsMicroserviceConstants.COMPLAINS_SERVICE_FIND_ONE_BY_ID_MESSAGE_PATTERN}/v${this.version}`,
        },
        findOneByIdDto,
      ),
    );
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdDto: FindOneOrFailByIdDto<Complain>): Promise<Complain> {
    const complain: Complain = await this.findOneById(<FindOneByIdDto<Complain>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!complain) {
      throw new NotFoundException(findOneOrFailByIdDto.failureMessage || 'Complain not found.');
    }
    return complain;
  }
}
