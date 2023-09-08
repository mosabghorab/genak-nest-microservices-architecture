import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Complain, DateFilterOption, DateHelpers, FindOneByIdDto, FindOneOrFailByIdDto } from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindAllComplainsDto } from '../dtos/find-all-complains.dto';
import { UpdateComplainStatusDto } from '../dtos/update-complain-status.dto';
import { Constants } from '../../../../constants';
import { ComplainStatusChangedEvent } from '../events/complain-status-changed.event';

@Injectable()
export class AdminComplainsService {
  constructor(
    @InjectRepository(Complain)
    private readonly complainRepository: Repository<Complain>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // find one by id.
  async findOneById(findOneByIdDto: FindOneByIdDto<Complain>): Promise<Complain | null> {
    return this.complainRepository.findOne({
      where: { id: findOneByIdDto.id },
      relations: findOneByIdDto.relations,
    });
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

  // find all.
  async findAll(findAllComplainsDto: FindAllComplainsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    const offset: number = (findAllComplainsDto.page - 1) * findAllComplainsDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllComplainsDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllComplainsDto.startDate,
        endDate: findAllComplainsDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllComplainsDto.dateFilterOption);
    }
    const [complains, count]: [Complain[], number] = await this.complainRepository.findAndCount({
      where: {
        serviceType: findAllComplainsDto.serviceType,
        complainerUserType: findAllComplainsDto.userType,
        status: findAllComplainsDto.status,
        createdAt: dateRange ? Between(dateRange.startDate, dateRange.endDate) : null,
      },
      relations: { order: true },
      skip: offset,
      take: findAllComplainsDto.limit,
    });
    return {
      perPage: findAllComplainsDto.limit,
      currentPage: findAllComplainsDto.page,
      lastPage: Math.ceil(count / findAllComplainsDto.limit),
      total: count,
      data: complains,
    };
  }

  // update status.
  async updateStatus(id: number, updateComplainStatusDto: UpdateComplainStatusDto): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(<FindOneOrFailByIdDto<Complain>>{
      id,
    });
    complain.status = updateComplainStatusDto.status;
    const savedComplain: Complain = await this.complainRepository.save(complain);
    if (savedComplain) {
      this.eventEmitter.emit(Constants.COMPLAIN_STATUS_CHANGED_EVENT, new ComplainStatusChangedEvent(savedComplain));
    }
    return savedComplain;
  }

  // remove.
  async remove(id: number): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(<FindOneOrFailByIdDto<Complain>>{
      id,
    });
    return this.complainRepository.remove(complain);
  }
}
