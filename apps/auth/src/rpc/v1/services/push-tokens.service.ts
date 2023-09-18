import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllPushTokensPayloadDto, PushToken } from '@app/common';

@Injectable()
export class PushTokensService {
  constructor(
    @InjectRepository(PushToken)
    private readonly fcmTokenRepository: Repository<PushToken>,
  ) {}

  // find all.
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<PushToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllPushTokensPayloadDto.tokenableId,
        tokenableType: findAllPushTokensPayloadDto.tokenableType,
      },
    });
  }
}
