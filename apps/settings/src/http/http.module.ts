import { Module } from '@nestjs/common';
import { DatabaseModule, Setting } from '@app/common';
import { SettingsController } from './shared/v1/controllers/settings.controller';
import { SettingsService } from './shared/v1/services/settings.service';
import { AdminSettingsController } from './admin/v1/controllers/admin-settings.controller';
import { AdminSettingsService } from './admin/v1/services/admin-settings.service';

@Module({
  imports: [DatabaseModule.forFeature([Setting])],
  controllers: [AdminSettingsController, SettingsController],
  providers: [AdminSettingsService, SettingsService],
})
export class HttpModule {}
