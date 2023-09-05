import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from '../services/locations.service';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { Location, LocationDto, Public, Serialize } from '@app/common';

@Public()
@Controller({ path: 'locations', version: '1' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Serialize(LocationDto, 'All locations.')
  @Get()
  findAll(
    @Query() findAllLocationsDto: FindAllLocationsDto,
  ): Promise<Location[]> {
    return this.locationsService.findAll(findAllLocationsDto);
  }
}
