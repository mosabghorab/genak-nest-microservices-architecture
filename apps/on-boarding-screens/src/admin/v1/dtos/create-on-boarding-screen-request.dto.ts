import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ClientUserType } from '@app/common';

export class CreateOnBoardingScreenRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }): number => parseInt(value))
  index: number;

  @IsEnum(ClientUserType)
  userType: ClientUserType;
}
