export class FindAllAttachmentsByVendorIdAndDocumentIdPayloadDto {
  vendorId: number;
  documentId: number;

  constructor(data: { vendorId: number; documentId: number }) {
    Object.assign(this, data);
  }
}
