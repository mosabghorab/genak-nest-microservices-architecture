import { Controller } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DeleteFileDto, StorageMicroserviceConstants, UploadFileDto } from '@app/common';

const VERSION = '1';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @MessagePattern({ cmd: `${StorageMicroserviceConstants.MICROSERVICE_FUNCTION_UPLOAD_FILE}/v${VERSION}` })
  uploadFile(@Payload() uploadFileDto: UploadFileDto): Promise<string> {
    return this.storageService.uploadFile(uploadFileDto);
  }

  @MessagePattern({ cmd: `${StorageMicroserviceConstants.MICROSERVICE_FUNCTION_DELETE_FILE}/v${VERSION}` })
  deleteFile(@Payload() deleteFileDto: DeleteFileDto): Promise<boolean> {
    return this.storageService.deleteFile(deleteFileDto);
  }
}
