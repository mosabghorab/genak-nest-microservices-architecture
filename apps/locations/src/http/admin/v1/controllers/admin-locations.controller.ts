import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  FindOneOrFailByIdDto,
  Location,
  LocationDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Serialize,
  UserType,
} from '@app/common';
import { CreateLocationDto } from '../dtos/create-location.dto';
import { FindAllLocationsDto } from '../dtos/find-all-locations.dto';
import { UpdateLocationDto } from '../dtos/update-location.dto';
import { AdminLocationsService } from '../services/admin-locations.service';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.LOCATIONS)
@Controller({ path: 'admin/locations', version: '1' })
export class AdminLocationsController {
  constructor(private readonly adminLocationsService: AdminLocationsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(LocationDto, 'Location created successfully.')
  @Post()
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.adminLocationsService.create(createLocationDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationDto, 'All locations.')
  @Get()
  findAll(
    @Query() findAllLocationsDto: FindAllLocationsDto,
  ): Promise<Location[]> {
    return this.adminLocationsService.findAll(findAllLocationsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(LocationDto, 'One location.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Location> {
    return this.adminLocationsService.findOneOrFailById(<
      FindOneOrFailByIdDto<Location>
    >{
      id,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(LocationDto, 'Location updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.adminLocationsService.update(id, updateLocationDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(LocationDto, 'Location deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Location> {
    return this.adminLocationsService.remove(id);
  }
}
