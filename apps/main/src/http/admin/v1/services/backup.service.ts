import { Injectable, InternalServerErrorException, StreamableFile } from '@nestjs/common';
import { spawn } from 'child_process';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { createReadStream } from 'fs';
import * as fsExtra from 'fs-extra';

@Injectable()
export class BackupService {
  constructor(private readonly configService: ConfigService) {}

  // export.
  async export(): Promise<StreamableFile> {
    const mysqlPath = '/System/Volumes/Data/Applications/XAMPP/xamppfiles/bin/';
    const exportBackupProcess = spawn(`${mysqlPath}mysqldump`, [
      `--host=`,
      `--user=${this.configService.get<string>('DATABASE_USERNAME')}`,
      `--password=${this.configService.get<string>('DATABASE_PASSWORD')}`,
      this.configService.get<string>('DATABASE_NAME'),
    ]);
    const dirPath = './backups/';
    const filePath = `${dirPath}backup.sql`;
    await fsExtra.ensureDir(dirPath);
    const exportBackupStream = fs.createWriteStream(filePath);
    exportBackupProcess.stdout.pipe(exportBackupStream);
    return new Promise<StreamableFile>((resolve, reject): void => {
      exportBackupProcess.on('close', (code: number): void => {
        if (code === 0) {
          console.log('Database backup exported successfully.');
          resolve(new StreamableFile(createReadStream(filePath)));
        } else {
          console.error('Database export backup failed.');
          reject(new InternalServerErrorException('Database export backup failed.'));
        }
      });
    });
  }

  // import.
  async import(): Promise<void> {
    const mysqlPath = '/System/Volumes/Data/Applications/XAMPP/xamppfiles/bin/';
    const dirPath = './backups/';
    const filePath = `${dirPath}backup.sql`;
    const importBackupProcess = spawn(`${mysqlPath}mysql`, [
      `--user=${this.configService.get<string>('DATABASE_USERNAME')}`,
      `--password=${this.configService.get<string>('DATABASE_PASSWORD')}`,
      this.configService.get<string>('DATABASE_NAME'),
      '-e',
      `source ${filePath}`,
    ]);
    return new Promise<void>((resolve, reject): void => {
      importBackupProcess.on('close', (code: number): void => {
        if (code === 0) {
          console.log('Database backup imported successfully.');
          resolve();
        } else {
          console.error('Database import backup failed.');
          reject(new InternalServerErrorException('Database import backup failed.'));
        }
      });
    });
  }
}
