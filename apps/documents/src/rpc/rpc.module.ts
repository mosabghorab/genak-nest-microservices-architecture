import { Module } from '@nestjs/common';
import { DocumentsController } from './v1/controllers/documents.controller';
import { DatabaseModule, Document } from '@app/common';
import { DocumentsService } from './v1/services/documents.service';

@Module({
  imports: [DatabaseModule.forFeature([Document])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class RpcModule {}
