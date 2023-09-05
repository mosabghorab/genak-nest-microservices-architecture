import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneByIdDto, Reason } from '@app/common';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  findOneById(findOneByIdDto: FindOneByIdDto<Reason>): Promise<Reason | null> {
    return this.reasonRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
  }
}
