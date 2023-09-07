import { Controller } from '@nestjs/common';
import { Document, DocumentsMicroserviceConstants, FindAllDocumentsDto } from '@app/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DocumentsService } from '../services/documents.service';

const VERSION = '1';

@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @MessagePattern({
    cmd: `${DocumentsMicroserviceConstants.DOCUMENTS_SERVICE_FIND_ALL_MESSAGE_PATTERN}/v${VERSION}`,
  })
  findAll(@Payload() findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return this.documentsService.findAll(findAllDocumentsDto);
  }
}
