import { Module } from '@nestjs/common';
import { AttachmentsMicroserviceConstants, CustomClientsModule, DatabaseModule, StorageMicroserviceConstants, Vendor } from '@app/common';
import { VendorsController } from './v1/controllers/vendors.controller';
import { VendorsService } from './v1/services/vendors.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Vendor]),
    CustomClientsModule.register(AttachmentsMicroserviceConstants.NAME, AttachmentsMicroserviceConstants.CONFIG_NAME),
    CustomClientsModule.register(StorageMicroserviceConstants.NAME, StorageMicroserviceConstants.CONFIG_NAME),
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class RpcModule {}
