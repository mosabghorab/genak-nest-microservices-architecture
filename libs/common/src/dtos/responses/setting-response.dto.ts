import { Expose } from 'class-transformer';

export class SettingResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  value: string;

  @Expose()
  group: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
