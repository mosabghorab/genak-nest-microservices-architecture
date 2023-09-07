import { SetMetadata } from '@nestjs/common';
import { UserType } from '@app/common';

export const ALLOW_FOR_KEY = 'allowFor';

export const AllowFor = (...types: UserType[]) => SetMetadata(ALLOW_FOR_KEY, types);
