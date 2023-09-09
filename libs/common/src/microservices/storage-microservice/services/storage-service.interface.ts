import { DeleteFileDto, UploadFileDto } from '@app/common';

export interface IStorageService {
  // upload file.
  uploadFile(uploadFileDto: UploadFileDto): Promise<string>;

  // delete file.
  deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean>;
}
