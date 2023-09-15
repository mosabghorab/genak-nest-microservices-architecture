import { IsEnum } from 'class-validator';
import { ClientUserType } from '@app/common';

export class FindAllOnBoardingScreensRequestDto {
  @IsEnum(ClientUserType)
  userType: ClientUserType;
}
