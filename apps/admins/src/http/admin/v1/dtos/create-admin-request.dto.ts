import { IsArray, IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdminRequestDto {
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
