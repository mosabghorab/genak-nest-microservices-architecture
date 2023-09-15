import { Injectable } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { DeleteFilePayloadDto, UploadFilePayloadDto } from '@app/common';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

  // upload file.
  uploadFile(uploadFilePayloadDto: UploadFilePayloadDto): Promise<string> {
    return this.firebaseStorageService.uploadFile(uploadFilePayloadDto);
  }

  // delete file.
  deleteFile(deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean> {
    return this.firebaseStorageService.deleteFile(deleteFilePayloadDto);
  }
}
