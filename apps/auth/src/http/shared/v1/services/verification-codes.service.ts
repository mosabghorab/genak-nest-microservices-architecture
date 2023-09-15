import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientUserType, OrderByType, SendSmsNotificationPayloadDto, VerificationCode } from '@app/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Constants } from '../../../../constants';
import { VerificationCodeCreatedEvent } from '../events/verification-code-created.event';

@Injectable()
export class VerificationCodesService {
  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // find last one or Fail by phone.
  async findLastOneOrFailByPhone(phone: string, verifiableType: ClientUserType): Promise<VerificationCode> {
    const verificationCode: VerificationCode = await this.verificationCodeRepository.findOne({
      where: { phone, verifiableType },
      order: {
        createdAt: OrderByType.DESC,
      },
    });
    if (!verificationCode) {
      throw new NotFoundException('Verification code not found.');
    }
    return verificationCode;
  }

  // create.
  async create(phone: string, verifiableType: ClientUserType): Promise<void> {
    const code: string = (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString();
    const verificationCode: VerificationCode = await this.verificationCodeRepository.save(
      await this.verificationCodeRepository.create({
        phone,
        code,
        verifiableType,
      }),
    );
    if (verificationCode) {
      this.eventEmitter.emit(
        Constants.VERIFICATION_CODE_CREATED_EVENT,
        new VerificationCodeCreatedEvent(
          new SendSmsNotificationPayloadDto({
            phone,
            message: `Your verification code for genak app is : ${code}`,
          }),
        ),
      );
    }
  }
}
