import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FcmToken, FindAllPushTokensPayloadDto } from '@app/common';
import { FindOnePushTokenPayloadDto } from '../dtos/find-one-push-token-payload.dto';
import { CreatePushTokenPayloadDto } from '../dtos/create-push-token-payload.dto';

@Injectable()
export class PushTokensService {
  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  // find one.
  findOne(findOnePushTokenPayloadDto: FindOnePushTokenPayloadDto): Promise<FcmToken | null> {
    return this.fcmTokenRepository.findOne({
      where: {
        token: findOnePushTokenPayloadDto.token,
        tokenableType: findOnePushTokenPayloadDto.tokenableType,
        tokenableId: findOnePushTokenPayloadDto.tokenableId,
      },
    });
  }

  // find all.
  findAll(findAllPushTokensPayloadDto: FindAllPushTokensPayloadDto): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllPushTokensPayloadDto.tokenableId,
        tokenableType: findAllPushTokensPayloadDto.tokenableType,
      },
    });
  }

  // create.
  async create(createPushTokenPayloadDto: CreatePushTokenPayloadDto): Promise<FcmToken> {
    return this.fcmTokenRepository.create(await this.fcmTokenRepository.save(createPushTokenPayloadDto));
  }

  // remove one by instance.
  removeOneByInstance(fcmToken: FcmToken): Promise<FcmToken> {
    return this.fcmTokenRepository.remove(fcmToken);
  }
}
