import { Module } from '@nestjs/common';
import { DatabaseModule, PushToken } from '@app/common';
import { PushTokensController } from './v1/controllers/push-tokens.controller';
import { PushTokensService } from './v1/services/push-tokens.service';

@Module({
  imports: [DatabaseModule.forFeature([PushToken])],
  controllers: [PushTokensController],
  providers: [PushTokensService],
})
export class RpcModule {}
