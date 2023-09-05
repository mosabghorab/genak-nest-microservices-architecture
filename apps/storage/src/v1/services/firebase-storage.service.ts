import { Injectable } from '@nestjs/common';
import { DeleteFileDto, Helpers, UploadFileDto } from '@app/common';
import { firebaseAdmin } from '../../firebase-admin-init';

@Injectable()
export class FirebaseStorageService {
  private readonly storage = firebaseAdmin.storage();
  private readonly bucket: any = this.storage.bucket();

  // upload file.
  async uploadFile(uploadFileDto: UploadFileDto): Promise<string> {
    try {
      const filePath = `${uploadFileDto.prefixPath}${Helpers.generateUniqueFileName()}.${uploadFileDto.file.mimetype.split('/')[1]}`;
      const fileToUpload: any = this.bucket.file(filePath);
      const uploadStream = fileToUpload.createWriteStream({
        metadata: {
          contentType: uploadFileDto.file.mimetype,
        },
      });
      const buffer: Buffer = Buffer.from(uploadFileDto.file.buffer);
      uploadStream.end(buffer);
      return new Promise<string>((resolve, reject): void => {
        uploadStream
          .on('error', (error): void => {
            console.log(error);
            reject(error);
          })
          .on('finish', async (): Promise<void> => {
            const [url] = await fileToUpload.getSignedUrl({ action: 'read', expires: '01-01-2030' });
            resolve(url);
          });
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // delete file.
  async deleteFile(deleteFileDto: DeleteFileDto): Promise<boolean> {
    try {
      const urlParts: string[] = deleteFileDto.fileUrl.split('/');
      const fileNameWithParams: string = urlParts[urlParts.length - 1];
      const fileName: string = fileNameWithParams.split('?')[0];
      const fileToDelete: any = this.bucket.file(`${deleteFileDto.prefixPath}${fileName}`);
      await fileToDelete.delete();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
