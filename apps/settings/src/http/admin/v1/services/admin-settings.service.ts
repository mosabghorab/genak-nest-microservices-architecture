import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from '@app/common';
import { CreateSettingRequestDto } from '../dtos/create-setting-request.dto';
import { UpdateSettingRequestDto } from '../dtos/update-setting-request.dto';

@Injectable()
export class AdminSettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  // find one by id.
  findOneById(id: number): Promise<Setting | null> {
    return this.settingRepository.findOne({ where: { id } });
  }

  // find one or fail by id.
  async findOneOrFailById(id: number, failureMessage?: string): Promise<Setting> {
    const setting: Setting = await this.findOneById(id);
    if (!setting) {
      throw new BadRequestException(failureMessage || 'Setting not found.');
    }
    return setting;
  }

  // create.
  async create(createSettingRequestDto: CreateSettingRequestDto): Promise<Setting> {
    return this.settingRepository.save(await this.settingRepository.create(createSettingRequestDto));
  }

  // find all.
  findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  // update.
  async update(id: number, updateSettingRequestDto: UpdateSettingRequestDto): Promise<Setting> {
    const setting: Setting = await this.findOneOrFailById(id);
    Object.assign(setting, updateSettingRequestDto);
    return this.settingRepository.save(setting);
  }

  // remove.
  async remove(id: number): Promise<Setting> {
    const setting: Setting = await this.findOneOrFailById(id);
    return this.settingRepository.remove(setting);
  }
}
