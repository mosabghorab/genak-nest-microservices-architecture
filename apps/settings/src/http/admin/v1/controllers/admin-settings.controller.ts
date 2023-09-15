import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, Setting, SettingResponseDto, UserType } from '@app/common';
import { AdminSettingsService } from '../services/admin-settings.service';
import { CreateSettingRequestDto } from '../dtos/create-setting-request.dto';
import { UpdateSettingRequestDto } from '../dtos/update-setting-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.SETTINGS)
@Controller({ path: 'admin/settings', version: '1' })
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(SettingResponseDto, 'Setting created successfully.')
  @Post()
  create(@Body() createSettingRequestDto: CreateSettingRequestDto): Promise<Setting> {
    return this.adminSettingsService.create(createSettingRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingResponseDto, 'All settings.')
  @Get()
  findAll(): Promise<Setting[]> {
    return this.adminSettingsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingResponseDto, 'One setting.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Setting> {
    return this.adminSettingsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(SettingResponseDto, 'Setting updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSettingRequestDto: UpdateSettingRequestDto): Promise<Setting> {
    return this.adminSettingsService.update(id, updateSettingRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(SettingResponseDto, 'Setting deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Setting> {
    return this.adminSettingsService.remove(id);
  }
}
