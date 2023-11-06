import { Injectable } from '@nestjs/common';
import { PermissionsSeederService } from './permissions/permissions-seeder.service';
import { RolesSeederService } from './roles/roles-seeder.service';
import { AdminsSeederService } from './admins/admins-seeder.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly permissionsSeederService: PermissionsSeederService,
    private readonly rolesSeederService: RolesSeederService,
    private readonly adminsSeederService: AdminsSeederService,
  ) {}

  // seed.
  async seed(): Promise<void> {
    await this.permissionsSeederService.seed();
    await this.rolesSeederService.seed();
    await this.adminsSeederService.seed();
  }
}
