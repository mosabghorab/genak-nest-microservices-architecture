import { UserType } from '@app/common/enums';

export class FindOnePushTokenPayloadDto {
  tokenableId: number;
  tokenableType: UserType;
  token: string;
}
