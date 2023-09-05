import { Module } from '@nestjs/common';
import { LocationsController } from './v1/controllers/locations.controller';
import { DatabaseModule, Location } from '@app/common';
import { LocationsService } from './v1/services/locations.service';

@Module({
  imports: [DatabaseModule.forFeature([Location])],
  controllers: [LocationsController],
  providers: [LocationsService],
})
export class RpcModule {}
