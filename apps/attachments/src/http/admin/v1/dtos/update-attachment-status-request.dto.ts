import { IsEnum } from 'class-validator';
import { AttachmentStatus } from '@app/common';

export class UpdateAttachmentStatusRequestDto {
  @IsEnum(AttachmentStatus)
  status: AttachmentStatus;
}
