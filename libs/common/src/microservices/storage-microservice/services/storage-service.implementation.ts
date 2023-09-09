import { DeleteFileDto, IStorageService, StorageMicroserviceConstants, UploadFileDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class StorageServiceImpl implements IStorageService {
  constructor(private readonly storageMicroservice: ClientProxy, private readonly version: string) {}

  // upload file.
  uploadFile(uploadFileDto: UploadFileDto): Promise<string> {
    return firstValueFrom<string>(
      this.storageMicroservice.send<string, UploadFileDto>(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_UPLOAD_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        uploadFileDto,
      ),
    );
  }

  // delete file.
  deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.storageMicroservice.send<boolean, DeleteFileDto>(
        {
          cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_DELETE_FILE_MESSAGE_PATTERN}/v${this.version}`,
        },
        deleteFileDto,
      ),
    );
  }
}
