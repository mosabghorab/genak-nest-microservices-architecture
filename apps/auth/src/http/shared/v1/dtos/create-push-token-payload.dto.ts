import { UserType } from '@app/common/enums';

export class CreatePushTokenPayloadDto {
  tokenableId: number;
  tokenableType: UserType;
  token: string;
}
