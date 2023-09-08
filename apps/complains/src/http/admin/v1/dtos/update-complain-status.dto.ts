import { IsEnum } from 'class-validator';
import { ComplainStatus } from '@app/common';

export class UpdateComplainStatusDto {
  @IsEnum(ComplainStatus)
  status: ComplainStatus;
}
