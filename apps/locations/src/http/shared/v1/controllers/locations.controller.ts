import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from '../services/locations.service';
import { FindAllLocationsRequestDto } from '../dtos/find-all-locations-request.dto';
import { Location, LocationResponseDto, Public, Serialize } from '@app/common';

@Public()
@Controller({ path: 'locations', version: '1' })
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Serialize(LocationResponseDto, 'All locations.')
  @Get()
  findAll(@Query() findAllLocationsRequestDto: FindAllLocationsRequestDto): Promise<Location[]> {
    return this.locationsService.findAll(findAllLocationsRequestDto);
  }
}
