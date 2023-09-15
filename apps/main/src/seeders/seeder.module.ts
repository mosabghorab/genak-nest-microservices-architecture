import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PermissionsSeederService } from './permissions/permissions-seeder.service';
import { CustomConfigModule, DatabaseModule, Permission } from '@app/common';

@Module({
  imports: [CustomConfigModule, DatabaseModule.forRoot(), DatabaseModule.forFeature([Permission])],
  providers: [SeederService, PermissionsSeederService],
})
export class SeederModule {}
