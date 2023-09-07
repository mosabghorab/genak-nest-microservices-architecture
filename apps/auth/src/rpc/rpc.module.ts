import { Module } from '@nestjs/common';
import { DatabaseModule, FcmToken } from '@app/common';
import { FcmTokensController } from './v1/controllers/fcm-tokens.controller';
import { FcmTokensService } from './v1/services/fcm-tokens.service';

@Module({
  imports: [DatabaseModule.forFeature([FcmToken])],
  controllers: [FcmTokensController],
  providers: [FcmTokensService],
})
export class RpcModule {}
