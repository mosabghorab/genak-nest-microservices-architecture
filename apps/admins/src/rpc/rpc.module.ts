import { Module } from '@nestjs/common';
import { Admin, DatabaseModule } from '@app/common';
import { AdminsController } from './v1/controllers/admins.controller';
import { AdminsService } from './v1/services/admins.service';

@Module({
  imports: [DatabaseModule.forFeature([Admin])],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class RpcModule {}
