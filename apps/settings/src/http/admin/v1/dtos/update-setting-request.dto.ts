import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingRequestDto } from './create-setting-request.dto';

export class UpdateSettingRequestDto extends PartialType(CreateSettingRequestDto) {}
