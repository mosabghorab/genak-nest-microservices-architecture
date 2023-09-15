import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdPayloadDto, Location, LocationResponseDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { CreateLocationRequestDto } from '../dtos/create-location-request.dto';
import { FindAllLocationsRequestDto } from '../dtos/find-all-locations-request.dto';
import { UpdateLocationRequestDto } from '../dtos/update-location-request.dto';
import { AdminLocationsService } from '../services/admin-locations.service';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.LOCATIONS)
@Controller({ path: 'admin/locations', version: '1' })
export class AdminLocationsController {
  constructor(private readonly adminLocationsService: AdminLocationsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(LocationResponseDto, 'Location created successfully.')
  @Post()
  create(@Body() createLocationRequestDto: CreateLocationRequestDto): Promise<Location> {
    return this.adminLocationsService.create(createLocationRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationResponseDto, 'All locations.')
  @Get()
  findAll(@Query() findAllLocationsRequestDto: FindAllLocationsRequestDto): Promise<Location[]> {
    return this.adminLocationsService.findAll(findAllLocationsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationResponseDto, 'One location.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Location> {
    return this.adminLocationsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Location>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(LocationResponseDto, 'Location updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateLocationRequestDto: UpdateLocationRequestDto): Promise<Location> {
    return this.adminLocationsService.update(id, updateLocationRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(LocationResponseDto, 'Location deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Location> {
    return this.adminLocationsService.remove(id);
  }
}
