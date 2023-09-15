import { Expose, Type } from 'class-transformer';
import { VendorResponseDto } from './vendor-response.dto';
import { DocumentResponseDto } from './document-response.dto';
import { AttachmentStatus } from '@app/common';

export class AttachmentResponseDto {
  @Expose()
  id: number;

  @Expose()
  documentId: number;

  @Expose()
  vendorId: number;

  @Expose()
  file: string;

  @Expose()
  status: AttachmentStatus;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => DocumentResponseDto)
  document: DocumentResponseDto;

  @Expose()
  @Type(() => VendorResponseDto)
  vendor: VendorResponseDto;
}
