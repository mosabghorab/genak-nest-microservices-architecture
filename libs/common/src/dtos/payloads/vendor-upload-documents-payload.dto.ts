import { CreateAttachmentPayloadDto } from '@app/common';

export class VendorUploadDocumentsPayloadDto {
  vendorId: number;
  createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[];

  constructor(data: { vendorId: number; createAttachmentPayloadDtoList: CreateAttachmentPayloadDto[] }) {
    Object.assign(this, data);
  }
}
