import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@app/common';
import { Repository } from 'typeorm';
import { permissionsData } from './permissions-data';

@Injectable()
export class PermissionsSeederService {
  constructor(@InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>) {}

  // seed.
  async seed(): Promise<void> {
    for (const permission of permissionsData) {
      const permissionIsExist: Permission = await this.permissionRepository.findOne({
        where: {
          action: permission.action,
          group: permission.group,
        },
      });
      if (!permissionIsExist) {
        await this.permissionRepository.save(permission);
      }
    }
  }
}
