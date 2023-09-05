import { Module } from '@nestjs/common';
import { AttachmentsController } from './v1/controllers/attachments.controller';
import { Attachment, CustomClientsModule, DatabaseModule, StorageMicroserviceConstants } from '@app/common';
import { AttachmentsService } from './v1/services/attachments.service';

@Module({
  imports: [DatabaseModule.forFeature([Attachment]), CustomClientsModule.register(StorageMicroserviceConstants.MICROSERVICE_NAME, StorageMicroserviceConstants.MICROSERVICE_CONFIG_NAME)],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class RpcModule {}
