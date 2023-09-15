import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto, Reason } from '@app/common';
import { CreateReasonRequestDto } from '../dtos/create-reason-request.dto';
import { UpdateReasonRequestDto } from '../dtos/update-reason-request.dto';

@Injectable()
export class AdminReasonsService {
  constructor(
    @InjectRepository(Reason)
    private readonly reasonRepository: Repository<Reason>,
  ) {}

  // find one by id.
  findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Reason>): Promise<Reason | null> {
    return this.reasonRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
  }

  // find one or fail by id.
  async findOneOrFailById(findOneOrFailByIdPayloadDto: FindOneOrFailByIdPayloadDto<Reason>): Promise<Reason> {
    const reason: Reason = await this.findOneById(
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

  // find all.
  findAll(): Promise<Reason[]> {
    return this.reasonRepository.find();
  }

  // create.
  async create(createReasonRequestDto: CreateReasonRequestDto): Promise<Reason> {
    return this.reasonRepository.save(await this.reasonRepository.create(createReasonRequestDto));
  }

  // update.
  async update(id: number, updateReasonRequestDto: UpdateReasonRequestDto): Promise<Reason> {
    const reason: Reason = await this.findOneOrFailById(
      new FindOneByIdPayloadDto<Reason>({
        id,
      }),
    );
    Object.assign(reason, updateReasonRequestDto);
    return this.reasonRepository.save(reason);
  }

  // remove.
  async remove(id: number): Promise<Reason> {
    const reason: Reason = await this.findOneOrFailById(
      new FindOneByIdPayloadDto<Reason>({
        id,
      }),
    );
    return this.reasonRepository.remove(reason);
  }
}
