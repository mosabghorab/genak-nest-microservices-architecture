import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CreateOnBoardingScreenRequestDto } from './create-on-boarding-screen-request.dto';

export class UpdateOnBoardingScreenRequestDto extends PartialType(CreateOnBoardingScreenRequestDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => value === 'true')
  active?: boolean;
}
