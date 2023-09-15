export class CreateAttachmentPayloadDto {
  documentId: number;
  vendorId: number;
  file: Express.Multer.File;

  constructor(data: { documentId: number; vendorId: number; file: Express.Multer.File }) {
    Object.assign(this, data);
  }
}
