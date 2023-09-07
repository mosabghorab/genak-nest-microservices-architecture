import { UserType } from '@app/common/enums';

export class FindOneFcmTokenDto {
  tokenableId: number;
  tokenableType: UserType;
  token: string;
}
