import { DeleteFileDto, UploadFileDto } from '@app/common';

export interface IStorageMicroservice {
  uploadFile(uploadFileDto: UploadFileDto): Promise<string>;

  deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean>;
}
