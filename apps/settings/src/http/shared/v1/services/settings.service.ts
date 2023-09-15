import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '@app/common';
import { FindAllSettingsRequestDto } from '../dtos/find-all-settings-request.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  // find all.
  findAll(findAllSettingsRequestDto: FindAllSettingsRequestDto): Promise<Setting[]> {
    return this.settingRepository.find({
      where: { key: findAllSettingsRequestDto.key },
    });
  }
}
