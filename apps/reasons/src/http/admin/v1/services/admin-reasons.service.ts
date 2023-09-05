import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneByIdDto, FindOneOrFailByIdDto, Reason } from '@app/common';
import { CreateReasonDto } from '../dtos/create-reason.dto';
import { UpdateReasonDto } from '../dtos/update-reason.dto';

@Injectable()
export class AdminReasonsService {
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

  // find one or fail by id.
  async findOneOrFailById(
    findOneOrFailByIdDto: FindOneOrFailByIdDto<Reason>,
  ): Promise<Reason> {
    const reason: Reason = await this.findOneById(<FindOneByIdDto<Reason>>{
      id: findOneOrFailByIdDto.id,
      relations: findOneOrFailByIdDto.relations,
    });
    if (!reason) {
      throw new NotFoundException(
        findOneOrFailByIdDto.failureMessage || 'Reason not found.',
      );
    }
    return reason;
  }

  // find all.
  findAll(): Promise<Reason[]> {
    return this.reasonRepository.find();
  }

  // create.
  async create(createReasonDto: CreateReasonDto): Promise<Reason> {
    return this.reasonRepository.save(
      await this.reasonRepository.create(createReasonDto),
    );
  }

  // update.
  async update(id: number, updateReasonDto: UpdateReasonDto): Promise<Reason> {
    const reason: Reason = await this.findOneOrFailById(<
      FindOneByIdDto<Reason>
    >{
      id,
    });
    Object.assign(reason, updateReasonDto);
    return this.reasonRepository.save(reason);
  }

  // remove.
  async remove(id: number): Promise<Reason> {
    const reason: Reason = await this.findOneOrFailById(<
      FindOneByIdDto<Reason>
    >{
      id,
    });
    return this.reasonRepository.remove(reason);
  }
}
