import { DeleteFilePayloadDto, RpcAuthenticationPayloadDto, UploadFilePayloadDto } from '@app/common';

export interface IStorageService {
  // upload file.
  uploadFile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, uploadFilePayloadDto: UploadFilePayloadDto): Promise<string>;

  // delete file.
  deleteFile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean>;
}
