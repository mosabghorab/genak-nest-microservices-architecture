import { UserType } from '@app/common';

export type AuthedUser = {
  id: number;
  type: UserType;
  adminsRoles?: any[];
  authentication?: string;
};
