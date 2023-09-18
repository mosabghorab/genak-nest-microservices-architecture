import { Controller, UseGuards } from '@nestjs/common';
import { AllowFor, AuthGuard, Document, DocumentsMicroserviceConstants, FindAllDocumentsPayloadDto, SkipAdminRoles, UserType } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentsService } from '../services/documents.service';

const VERSION = '1';

@UseGuards(AuthGuard)
@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @AllowFor(UserType.ADMIN, UserType.VENDOR)
  @SkipAdminRoles()
  @MessagePattern({
    cmd: `${DocumentsMicroserviceConstants.DOCUMENTS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAll(@Payload('findAllDocumentsPayloadDto') findAllDocumentsPayloadDto: FindAllDocumentsPayloadDto): Promise<Document[]> {
    return this.documentsService.findAll(findAllDocumentsPayloadDto);
  }
}
