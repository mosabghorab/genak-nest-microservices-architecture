import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { FcmToken, FindAllFcmTokensDto } from '@app/common';

@Injectable()
export class FcmTokensService {
  constructor(
    @InjectRepository(FcmToken)
    private readonly fcmTokenRepository: Repository<FcmToken>,
  ) {}

  // find all.
  findAll(findAllFcmTokensDto: FindAllFcmTokensDto): Promise<FcmToken[]> {
    return this.fcmTokenRepository.find({
      where: {
        tokenableId: findAllFcmTokensDto.tokenableId,
        tokenableType: findAllFcmTokensDto.tokenableType,
      },
    });
  }
}
