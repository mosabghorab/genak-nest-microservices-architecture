import { Module } from '@nestjs/common';
import { Admin, AdminsRoles, DatabaseModule, Role, RolesPermissions } from '@app/common';
import { AdminsController } from './admin/v1/controllers/admins.controller';
import { RolesController } from './admin/v1/controllers/roles.controller';
import { AdminsService } from './admin/v1/services/admins.service';
import { RolesService } from './admin/v1/services/roles.service';
import { RolesPermissionsService } from './admin/v1/services/roles-permissions.service';
import { AdminsRolesService } from './admin/v1/services/admins-roles.service';

@Module({
  imports: [DatabaseModule.forFeature([Admin, Role, AdminsRoles, RolesPermissions])],
  controllers: [AdminsController, RolesController],
  providers: [AdminsService, RolesService, RolesPermissionsService, AdminsRolesService],
})
export class HttpModule {}
