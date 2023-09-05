import { IsEnum } from 'class-validator';
import { AttachmentStatus } from '@app/common';

export class UpdateAttachmentStatusDto {
  @IsEnum(AttachmentStatus)
  status: AttachmentStatus;
}
