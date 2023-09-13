import { Expose, Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';
import { ServiceType } from '@app/common';

export class DocumentDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: DocumentDto;

  @Expose()
  serviceType: ServiceType;

  @Expose()
  required: boolean;

  @Expose()
  active: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
}
