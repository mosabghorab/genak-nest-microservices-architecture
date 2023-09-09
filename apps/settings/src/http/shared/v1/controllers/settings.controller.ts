import { Controller, Get, Query } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { FindAllSettingsDto } from '../dtos/find-all-settings.dto';
import { Public, Serialize, Setting, SettingDto } from '@app/common';

@Public()
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Serialize(SettingDto, 'All settings.')
  @Get()
  findAll(@Query() findAllSettingsDto: FindAllSettingsDto): Promise<Setting[]> {
    return this.settingsService.findAll(findAllSettingsDto);
  }
}
