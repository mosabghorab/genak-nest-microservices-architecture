import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FcmToken, FindAllPushTokensPayloadDto } from '@app/common';

@Injectable()
export class FcmTokensService {
  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  // find all.
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllPushTokensPayloadDto.tokenableId,
        tokenableType: findAllPushTokensPayloadDto.tokenableType,
      },
    });
  }
}
