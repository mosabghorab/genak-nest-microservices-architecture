import { Injectable } from '@nestjs/common';
import { DeleteFilePayloadDto, Helpers, UploadFilePayloadDto } from '@app/common';
import { firebaseAdmin } from '../../firebase-admin-init';

@Injectable()
export class FirebaseStorageService {
  private readonly storage = firebaseAdmin.storage();
  private readonly bucket: any = this.storage.bucket();

  // upload file.
  async uploadFile(uploadFilePayloadDto: UploadFilePayloadDto): Promise<string> {
    try {
      const filePath = `${uploadFilePayloadDto.prefixPath}${Helpers.generateUniqueFileName()}.${uploadFilePayloadDto.file.mimetype.split('/')[1]}`;
      const fileToUpload: any = this.bucket.file(filePath);
      const uploadStream = fileToUpload.createWriteStream({
        metadata: {
          contentType: uploadFilePayloadDto.file.mimetype,
        },
      });
      const buffer: Buffer = Buffer.from(uploadFilePayloadDto.file.buffer);
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
  async deleteFile(deleteFilePayloadDto: DeleteFilePayloadDto): Promise<boolean> {
    try {
      const urlParts: string[] = deleteFilePayloadDto.fileUrl.split('/');
      const fileNameWithParams: string = urlParts[urlParts.length - 1];
      const fileName: string = fileNameWithParams.split('?')[0];
      const fileToDelete: any = this.bucket.file(`${deleteFilePayloadDto.prefixPath}${fileName}`);
      await fileToDelete.delete();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
