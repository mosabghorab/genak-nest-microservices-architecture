import { UserType } from '@app/common/enums';

export class FindAllPushTokensPayloadDto {
  tokenableId: number;
  tokenableType: UserType;

  constructor(data: { tokenableId: number; tokenableType: UserType }) {
    Object.assign(this, data);
  }
}
