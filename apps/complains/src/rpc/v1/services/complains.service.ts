import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complain, FindOneByIdDto } from '@app/common';

@Injectable()
export class ComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Complain>): Promise<Complain | null> {
    return this.complainRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }
}
