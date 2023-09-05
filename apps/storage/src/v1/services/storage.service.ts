import { Injectable } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { DeleteFileDto, UploadFileDto } from '@app/common';

@Injectable()
export class StorageService {
  constructor(private readonly firebaseStorageService: FirebaseStorageService) {}

  // upload file.
  uploadFile(uploadFileDto: UploadFileDto): Promise<string> {
    return this.firebaseStorageService.uploadFile(uploadFileDto);
  }

  // delete file.
  deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean> {
    return this.firebaseStorageService.deleteFile(deleteFileDto);
  }
}
