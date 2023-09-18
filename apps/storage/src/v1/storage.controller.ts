import { Controller, UseGuards } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AllowFor, AuthGuard, DeleteFilePayloadDto, SkipAdminRoles, StorageMicroserviceConstants, UploadFilePayloadDto, UserType } from '@app/common';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({ cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_UPLOAD_FILE_MESSAGE_PATTERN}/v${VERSION}` })
  uploadFile(@Payload('uploadFilePayloadDto') uploadFilePayloadDto: UploadFilePayloadDto): Promise<string> {
    return this.storageService.uploadFile(uploadFilePayloadDto);
  }

  @AllowFor(UserType.ADMIN, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({ cmd: `${StorageMicroserviceConstants.STORAGE_SERVICE_DELETE_FILE_MESSAGE_PATTERN}/v${VERSION}` })
  deleteFile(@Payload('deleteFilePayloadDto') deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean> {
    return this.storageService.deleteFile(deleteFilePayloadDto);
  }
}
