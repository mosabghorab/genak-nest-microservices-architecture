import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { AuthedUser, Complain, DateFilterOption, DateHelpers, FindOneByIdPayloadDto, FindOneOrFailByIdPayloadDto } from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FindAllComplainsRequestDto } from '../dtos/find-all-complains-request.dto';
import { UpdateComplainStatusRequestDto } from '../dtos/update-complain-status-request.dto';
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
  async findOneById(findOneByIdPayloadDto: FindOneByIdPayloadDto<Complain>): Promise<Complain | null> {
    return this.complainRepository.findOne({
      where: { id: findOneByIdPayloadDto.id },
      relations: findOneByIdPayloadDto.relations,
    });
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

  // find all.
  async findAll(findAllComplainsRequestDto: FindAllComplainsRequestDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    const offset: number = (findAllComplainsRequestDto.page - 1) * findAllComplainsRequestDto.limit;
    let dateRange: { startDate: Date; endDate: Date };
    if (findAllComplainsRequestDto.dateFilterOption === DateFilterOption.CUSTOM) {
      dateRange = {
        startDate: findAllComplainsRequestDto.startDate,
        endDate: findAllComplainsRequestDto.endDate,
      };
    } else {
      dateRange = DateHelpers.getDateRangeForDateFilterOption(findAllComplainsRequestDto.dateFilterOption);
    }
    const [complains, count]: [Complain[], number] = await this.complainRepository.findAndCount({
      where: {
        serviceType: findAllComplainsRequestDto.serviceType,
        complainerUserType: findAllComplainsRequestDto.userType,
        status: findAllComplainsRequestDto.status,
        createdAt: dateRange ? Between(dateRange.startDate, dateRange.endDate) : null,
      },
      relations: { order: true },
      skip: offset,
      take: findAllComplainsRequestDto.limit,
    });
    return {
      perPage: findAllComplainsRequestDto.limit,
      currentPage: findAllComplainsRequestDto.page,
      lastPage: Math.ceil(count / findAllComplainsRequestDto.limit),
      total: count,
      data: complains,
    };
  }

  // update status.
  async updateStatus(authedUser: AuthedUser, id: number, updateComplainStatusRequestDto: UpdateComplainStatusRequestDto): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Complain>({
        id,
      }),
    );
    complain.status = updateComplainStatusRequestDto.status;
    const savedComplain: Complain = await this.complainRepository.save(complain);
    if (savedComplain) {
      this.eventEmitter.emit(Constants.COMPLAIN_STATUS_CHANGED_EVENT, new ComplainStatusChangedEvent(authedUser, savedComplain));
    }
    return savedComplain;
  }

  // remove.
  async remove(id: number): Promise<Complain> {
    const complain: Complain = await this.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Complain>({
        id,
      }),
    );
    return this.complainRepository.remove(complain);
  }
}
