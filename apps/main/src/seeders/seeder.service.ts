import { Injectable } from '@nestjs/common';
import { PermissionsSeederService } from './permissions/permissions-seeder.service';

@Injectable()
export class SeederService {
  constructor(private readonly permissionsSeederService: PermissionsSeederService) {}

  // seed.
  async seed(): Promise<void> {
    await this.permissionsSeederService.seed();
  }
}
