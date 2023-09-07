import { UserType } from '@app/common/enums';

export class FindAllFcmTokensDto {
  tokenableId: number;
  tokenableType: UserType;
}
