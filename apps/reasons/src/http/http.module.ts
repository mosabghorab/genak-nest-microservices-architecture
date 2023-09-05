import { Module } from '@nestjs/common';
import { AdminReasonsController } from './admin/v1/controllers/admin-reasons.controller';
import { AdminReasonsService } from './admin/v1/services/admin-reasons.service';
import { ReasonsController } from './shared/v1/controllers/reasons.controller';
import { ReasonsService } from './shared/v1/services/reasons.service';
import { DatabaseModule, Reason } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Reason])],
  controllers: [AdminReasonsController, ReasonsController],
  providers: [AdminReasonsService, ReasonsService],
})
export class HttpModule {}
