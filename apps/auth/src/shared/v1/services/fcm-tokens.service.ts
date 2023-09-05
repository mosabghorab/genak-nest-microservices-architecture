import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FcmToken, UserType } from '@app/common';

@Injectable()
export class FcmTokensService {
  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  // find one.
  findOne(tokenableId: number, tokenableType: UserType, token: string): Promise<FcmToken | null> {
    return this.fcmTokenRepository.findOne({ where: { token, tokenableType, tokenableId } });
  }

  // find all by tokenable id and tokenable type.
  findAllByTokenableIdAndTokenableType(tokenableId: number, tokenableType: UserType): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId,
        tokenableType,
      },
    });
  }

  // create.
  async create(tokenableId: number, tokenableType: UserType, token: string): Promise<FcmToken | null> {
    return this.fcmTokenRepository.create(
      await this.fcmTokenRepository.save({
        tokenableId,
        tokenableType,
        token,
      }),
    );
  }

  // remove one by instance.
  removeOneByInstance(fcmToken: FcmToken): Promise<FcmToken> {
    return this.fcmTokenRepository.remove(fcmToken);
  }
}
