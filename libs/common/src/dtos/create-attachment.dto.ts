export class CreateAttachmentDto {
  documentId: number;

  vendorId: number;

  file: Express.Multer.File;
}
