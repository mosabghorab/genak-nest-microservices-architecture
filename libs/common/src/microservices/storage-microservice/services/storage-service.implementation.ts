import { DeleteFilePayloadDto, IStorageService, RpcAuthenticationPayloadDto, StorageMicroserviceConstants, UploadFilePayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class StorageServiceImpl implements IStorageService {
  constructor(private readonly storageMicroservice: ClientProxy, private readonly version: string) {}

  // upload file.
  uploadFile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, uploadFilePayloadDto: UploadFilePayloadDto): Promise<string> {
    return firstValueFrom<string>(
      this.storageMicroservice.send<
        string,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          uploadFilePayloadDto: UploadFilePayloadDto;
        }
      >(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_UPLOAD_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, uploadFilePayloadDto },
      ),
    );
  }

  // delete file.
  deleteFile(rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto, deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.storageMicroservice.send<
        boolean,
        {
          rpcAuthenticationPayloadDto: RpcAuthenticationPayloadDto;
          deleteFilePayloadDto: DeleteFilePayloadDto;
        }
      >(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_DELETE_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { rpcAuthenticationPayloadDto, deleteFilePayloadDto },
      ),
    );
  }
}
