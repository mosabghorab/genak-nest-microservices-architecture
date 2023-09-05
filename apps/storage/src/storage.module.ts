import { Module } from '@nestjs/common';
import { StorageController } from './v1/storage.controller';
import { StorageService } from './v1/services/storage.service';
import { FirebaseStorageService } from './v1/services/firebase-storage.service';
import { CustomConfigModule } from '@app/common';

@Module({
  imports: [CustomConfigModule],
  controllers: [StorageController],
  providers: [StorageService, FirebaseStorageService],
})
export class StorageModule {}
