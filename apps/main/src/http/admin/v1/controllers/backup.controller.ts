import { Controller, FileTypeValidator, Header, ParseFilePipe, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, EmptyResponseDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { BackupService } from '../services/backup.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.BACKUPS)
@Controller({ path: 'admin/backup', version: '1' })
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @AdminMustCanDo(PermissionAction.EXPORT)
  @Header('Content-Disposition', 'attachment; filename="backup.sql"')
  @Post('export')
  export(): Promise<StreamableFile> {
    return this.backupService.export();
  }

  @AdminMustCanDo(PermissionAction.IMPORT)
  @Serialize(EmptyResponseDto, 'Database backup imported successfully.')
  @Post('import')
  @UseInterceptors(
    FileInterceptor('backup', {
      storage: diskStorage({
        destination: (req, file: Express.Multer.File, cb): void => {
          cb(null, './backups'); // Specify the directory where uploaded files will be stored
        },
        filename: (req, file: Express.Multer.File, cb): void => {
          cb(null, 'backup.sql');
        },
      }),
    }),
  )
  import(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [new FileTypeValidator({ fileType: 'sql' })],
      }),
    )
    backup: Express.Multer.File,
  ): Promise<void> {
    return this.backupService.import();
  }
}
