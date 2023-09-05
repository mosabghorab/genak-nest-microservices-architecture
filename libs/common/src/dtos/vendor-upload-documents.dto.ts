import { CreateAttachmentDto } from '@app/common';

export class VendorUploadDocumentsDto {
  vendorId: number;
  createAttachmentDtoList: CreateAttachmentDto[];
}
