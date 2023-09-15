export class DeleteFilePayloadDto {
  prefixPath: string;
  fileUrl: string;

  constructor(data: { prefixPath: string; fileUrl: string }) {
    Object.assign(this, data);
  }
}
