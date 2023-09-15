import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, Document, DocumentResponseDto, FindOneOrFailByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { CreateDocumentRequestDto } from '../dtos/create-document-request.dto';
import { AdminDocumentsService } from '../services/admin-documents.service';
import { UpdateDocumentRequestDto } from '../dtos/update-document-request.dto';
import { FindAllDocumentsDto } from '../dtos/find-all-documents.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.DOCUMENTS)
@Controller({ path: 'admin/documents', version: '1' })
export class AdminDocumentsController {
  constructor(private readonly adminDocumentsService: AdminDocumentsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(DocumentResponseDto, 'Document created successfully.')
  @Post()
  create(@Body() createDocumentRequestDto: CreateDocumentRequestDto): Promise<Document> {
    return this.adminDocumentsService.create(createDocumentRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentResponseDto, 'All documents.')
  @Get()
  findAll(@Query() findAllDocumentsDto: FindAllDocumentsDto): Promise<Document[]> {
    return this.adminDocumentsService.findAll(findAllDocumentsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentResponseDto, 'One document.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Document> {
    return this.adminDocumentsService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Document>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(DocumentResponseDto, 'Document updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDocumentRequestDto: UpdateDocumentRequestDto): Promise<Document> {
    return this.adminDocumentsService.update(id, updateDocumentRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(DocumentResponseDto, 'Document deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Document> {
    return this.adminDocumentsService.remove(id);
  }
}
