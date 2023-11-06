import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@app/common';
import { adminsData } from './admins-data';

@Injectable()
export class AdminsSeederService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // seed.
  async seed(): Promise<void> {
    for (const admin of adminsData) {
      const adminIsExist: Admin = await this.adminRepository.findOne({
        where: {
          id: admin.id,
        },
      });
      if (!adminIsExist) {
        await this.adminRepository.save(admin);
      }
    }
  }
}
