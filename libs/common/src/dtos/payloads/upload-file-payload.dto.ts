export class UploadFilePayloadDto {
  prefixPath: string;
  file: Express.Multer.File;

  constructor(data: { prefixPath: string; file: Express.Multer.File }) {
    Object.assign(this, data);
  }
}
