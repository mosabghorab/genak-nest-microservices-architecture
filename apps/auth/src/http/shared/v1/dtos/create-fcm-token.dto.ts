import { UserType } from '@app/common/enums';

export class CreateFcmTokenDto {
  tokenableId: number;
  tokenableType: UserType;
  token: string;
}
