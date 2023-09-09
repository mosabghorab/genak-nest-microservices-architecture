import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, Setting, SettingDto, UserType } from '@app/common';
import { AdminSettingsService } from '../services/admin-settings.service';
import { CreateSettingDto } from '../dtos/create-setting.dto';
import { UpdateSettingDto } from '../dtos/update-setting.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.SETTINGS)
@Controller({ path: 'admin/settings', version: '1' })
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(SettingDto, 'Setting created successfully.')
  @Post()
  create(@Body() createSettingDto: CreateSettingDto): Promise<Setting> {
    return this.adminSettingsService.create(createSettingDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'All settings.')
  @Get()
  findAll(): Promise<Setting[]> {
    return this.adminSettingsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(SettingDto, 'One setting.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Setting> {
    return this.adminSettingsService.findOneOrFailById(id);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(SettingDto, 'Setting updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSettingDto: UpdateSettingDto): Promise<Setting> {
    return this.adminSettingsService.update(id, updateSettingDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(SettingDto, 'Setting deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Setting> {
    return this.adminSettingsService.remove(id);
  }
}
