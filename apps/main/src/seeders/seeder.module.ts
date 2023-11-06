import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PermissionsSeederService } from './permissions/permissions-seeder.service';
import { CustomConfigModule, DatabaseModule, Permission } from '@app/common';
import { RolesSeederService } from './roles/roles-seeder.service';
import { AdminsSeederService } from './admins/admins-seeder.service';

@Module({
  imports: [CustomConfigModule, DatabaseModule.forRoot(), DatabaseModule.forFeature([Permission])],
  providers: [SeederService, PermissionsSeederService, RolesSeederService, AdminsSeederService],
})
export class SeederModule {}
