import { Module } from '@nestjs/common';
import { Complain, DatabaseModule } from '@app/common';
import { ComplainsController } from './v1/controllers/complains.controller';
import { ComplainsService } from './v1/services/complains.service';

@Module({
  imports: [DatabaseModule.forFeature([Complain])],
  controllers: [ComplainsController],
  providers: [ComplainsService],
})
export class RpcModule {}
