import { Module } from '@nestjs/common';
import { Attachment, CustomClientsModule, DatabaseModule, StorageMicroserviceConstants } from '@app/common';
import { AdminAttachmentsController } from './admin/v1/controllers/admin-attachments.controller';
import { AdminAttachmentsService } from './admin/v1/services/admin-attachments.service';

@Module({
  imports: [DatabaseModule.forFeature([Attachment]), CustomClientsModule.register(StorageMicroserviceConstants.MICROSERVICE_NAME, StorageMicroserviceConstants.MICROSERVICE_CONFIG_NAME)],
  controllers: [AdminAttachmentsController],
  providers: [AdminAttachmentsService],
})
export class HttpModule {}
