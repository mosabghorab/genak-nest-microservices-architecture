import { Expose, Type } from 'class-transformer';
import { AttachmentResponseDto } from './attachment-response.dto';
import { ServiceType } from '@app/common';

export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  type: DocumentResponseDto;

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
  @Type(() => AttachmentResponseDto)
  attachments: AttachmentResponseDto[];
}
