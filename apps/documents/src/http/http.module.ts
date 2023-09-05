import { Module } from '@nestjs/common';
import { DatabaseModule, Document } from '@app/common';
import { AdminDocumentsController } from './admin/v1/controllers/admin-documents.controller';
import { AdminDocumentsService } from './admin/v1/services/admin-documents.service';

@Module({
  imports: [DatabaseModule.forFeature([Document])],
  controllers: [AdminDocumentsController],
  providers: [AdminDocumentsService],
})
export class HttpModule {}
