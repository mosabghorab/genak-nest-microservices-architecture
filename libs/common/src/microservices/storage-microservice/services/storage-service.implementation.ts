import { DeleteFilePayloadDto, IStorageService, StorageMicroserviceConstants, UploadFilePayloadDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class StorageServiceImpl implements IStorageService {
  constructor(private readonly storageMicroservice: ClientProxy, private readonly version: string) {}

  // upload file.
  uploadFile(uploadFilePayloadDto: UploadFilePayloadDto): Promise<string> {
    return firstValueFrom<string>(
      this.storageMicroservice.send<string, { uploadFilePayloadDto: UploadFilePayloadDto }>(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_UPLOAD_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { uploadFilePayloadDto },
      ),
    );
  }

  // delete file.
  deleteFile(deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.storageMicroservice.send<boolean, { deleteFilePayloadDto: DeleteFilePayloadDto }>(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_DELETE_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        { deleteFilePayloadDto },
      ),
    );
  }
}
