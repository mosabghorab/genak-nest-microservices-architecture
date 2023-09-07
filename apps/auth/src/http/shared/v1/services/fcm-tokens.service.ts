import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FcmToken, FindAllFcmTokensDto } from '@app/common';
import { FindOneFcmTokenDto } from '../dtos/find-one-fcm-token.dto';
import { CreateFcmTokenDto } from '../dtos/create-fcm-token.dto';

@Injectable()
export class FcmTokensService {
  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  // find one.
  findOne(findOneFcmTokenDto: FindOneFcmTokenDto): Promise<FcmToken | null> {
    return this.fcmTokenRepository.findOne({
      where: {
        token: findOneFcmTokenDto.token,
        tokenableType: findOneFcmTokenDto.tokenableType,
        tokenableId: findOneFcmTokenDto.tokenableId,
      },
    });
  }

  // find all.
  findAll(findAllFcmTokensDto: FindAllFcmTokensDto): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllFcmTokensDto.tokenableId,
        tokenableType: findAllFcmTokensDto.tokenableType,
      },
    });
  }

  // create.
  async create(createFcmTokenDto: CreateFcmTokenDto): Promise<FcmToken> {
    return this.fcmTokenRepository.create(await this.fcmTokenRepository.save(createFcmTokenDto));
  }

  // remove one by instance.
  removeOneByInstance(fcmToken: FcmToken): Promise<FcmToken> {
    return this.fcmTokenRepository.remove(fcmToken);
  }
}
