import { DeleteFileDto, IStorageMicroservice, StorageMicroserviceConstants, UploadFileDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class StorageMicroserviceImpl implements IStorageMicroservice {
  constructor(private readonly storageMicroservice: ClientProxy, private readonly version: string) {}

  // upload file.
  uploadFile(uploadFileDto: UploadFileDto): Promise<string> {
    return firstValueFrom<string>(
      this.storageMicroservice.send(
        {
          cmd: `${StorageMicroserviceConstants.MICROSERVICE_FUNCTION_UPLOAD_FILE}/v${this.version}`,
        },
        uploadFileDto,
      ),
    );
  }

  // delete file.
  deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean> {
    return firstValueFrom<boolean>(
      this.storageMicroservice.send(
        {
          cmd: `${StorageMicroserviceConstants.MICROSERVICE_FUNCTION_DELETE_FILE}/v${this.version}`,
        },
        deleteFileDto,
      ),
    );
  }
}
