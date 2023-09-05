import { IsArray, IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsArray()
  @Transform(({ value }): any => JSON.parse(value))
  rolesIds: number[];
}
