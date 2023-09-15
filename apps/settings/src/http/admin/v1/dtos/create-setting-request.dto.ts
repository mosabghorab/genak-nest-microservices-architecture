import { IsString } from 'class-validator';

export class CreateSettingRequestDto {
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  value: string;

  @IsString()
  group: string;
}
