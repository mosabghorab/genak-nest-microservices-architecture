import { IsEnum } from 'class-validator';
import { ComplainStatus } from '@app/common';

export class UpdateComplainStatusRequestDto {
  @IsEnum(ComplainStatus)
  status: ComplainStatus;
}
