import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FindAllPushTokensPayloadDto, PushToken } from '@app/common';
import { FindOnePushTokenPayloadDto } from '../dtos/find-one-push-token-payload.dto';
import { CreatePushTokenPayloadDto } from '../dtos/create-push-token-payload.dto';

@Injectable()
export class PushTokensService {
  constructor(
    @InjectRepository(PushToken)
    private readonly fcmTokenRepository: Repository<PushToken>,
  ) {}

  // find one.
  findOne(findOnePushTokenPayloadDto: FindOnePushTokenPayloadDto): Promise<PushToken | null> {
    return this.fcmTokenRepository.findOne({
      where: {
        token: findOnePushTokenPayloadDto.token,
        tokenableType: findOnePushTokenPayloadDto.tokenableType,
        tokenableId: findOnePushTokenPayloadDto.tokenableId,
      },
    });
  }

  // find all.
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<PushToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllPushTokensPayloadDto.tokenableId,
        tokenableType: findAllPushTokensPayloadDto.tokenableType,
      },
    });
  }

  // create.
  async create(createPushTokenPayloadDto: CreatePushTokenPayloadDto): Promise<PushToken> {
    return this.fcmTokenRepository.create(await this.fcmTokenRepository.save(createPushTokenPayloadDto));
  }

  // remove one by instance.
  removeOneByInstance(fcmToken: PushToken): Promise<PushToken> {
    return this.fcmTokenRepository.remove(fcmToken);
  }
}
