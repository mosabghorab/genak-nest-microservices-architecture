import { IsEnum } from 'class-validator';
import { ClientUserType } from '@app/common';

export class FindAllOnBoardingScreensDto {
  @IsEnum(ClientUserType)
  userType: ClientUserType;
}
