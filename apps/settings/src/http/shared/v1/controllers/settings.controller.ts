import { Controller, Get, Query } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { FindAllSettingsRequestDto } from '../dtos/find-all-settings-request.dto';
import { Public, Serialize, Setting, SettingResponseDto } from '@app/common';

@Public()
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Serialize(SettingResponseDto, 'All settings.')
  @Get()
  findAll(@Query() findAllSettingsRequestDto: FindAllSettingsRequestDto): Promise<Setting[]> {
    return this.settingsService.findAll(findAllSettingsRequestDto);
  }
}
