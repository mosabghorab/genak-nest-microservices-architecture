import { DeleteFilePayloadDto, UploadFilePayloadDto } from '@app/common';

export interface IStorageService {
  // upload file.
  uploadFile(uploadFilePayloadDto: UploadFilePayloadDto): Promise<string>;

  // delete file.
  deleteFile(deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean>;
}
