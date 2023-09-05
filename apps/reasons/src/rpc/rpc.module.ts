import { Module } from '@nestjs/common';
import { ReasonsController } from './v1/controllers/reasons.controller';
import { ReasonsService } from './v1/services/reasons.service';
import { DatabaseModule, Reason } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Reason])],
  controllers: [ReasonsController],
  providers: [ReasonsService],
})
export class RpcModule {}
