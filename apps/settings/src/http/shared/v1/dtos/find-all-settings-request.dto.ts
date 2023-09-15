import { IsOptional, IsString } from 'class-validator';

export class FindAllSettingsRequestDto {
  @IsOptional()
  @IsString()
  key?: string;
}
