import { Module } from '@nestjs/common';
import { DatabaseModule, Location } from '@app/common';
import { AdminLocationsController } from './admin/v1/controllers/admin-locations.controller';
import { LocationsController } from './shared/v1/controllers/locations.controller';
import { LocationsService } from './shared/v1/services/locations.service';
import { AdminLocationsService } from './admin/v1/services/admin-locations.service';

@Module({
  imports: [DatabaseModule.forFeature([Location])],
  controllers: [AdminLocationsController, LocationsController],
  providers: [AdminLocationsService, LocationsService],
})
export class HttpModule {}
