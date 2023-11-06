import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '@app/common';
import { rolesData } from './roles-data';

@Injectable()
export class RolesSeederService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

  // seed.
  async seed(): Promise<void> {
    for (const role of rolesData) {
      const roleIsExist: Role = await this.roleRepository.findOne({
        where: {
          id: role.id,
        },
      });
      if (!roleIsExist) {
        await this.roleRepository.save(role);
      }
    }
  }
}
