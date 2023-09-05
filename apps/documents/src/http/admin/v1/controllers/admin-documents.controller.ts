import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  Document,
  DocumentDto,
  FindAllDocumentsDto,
  FindOneOrFailByIdDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Serialize,
  UserType,
} from '@app/common';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { AdminDocumentsService } from '../services/admin-documents.service';
import { UpdateDocumentDto } from '../dtos/update-document.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.DOCUMENTS)
@Controller({ path: 'admin/documents', version: '1' })
export class AdminDocumentsController {
  constructor(private readonly adminDocumentsService: AdminDocumentsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(DocumentDto, 'Document created successfully.')
  @Post()
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.adminDocumentsService.create(createDocumentDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentDto, 'All documents.')
  @Get()
  findAll(
    @Query() findAllDocumentsDto: FindAllDocumentsDto,
  ): Promise<Document[]> {
    return this.adminDocumentsService.findAll(findAllDocumentsDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(DocumentDto, 'One document.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Document> {
    return this.adminDocumentsService.findOneOrFailById(<
      FindOneOrFailByIdDto<Document>
    >{
      id,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(DocumentDto, 'Document updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.adminDocumentsService.update(id, updateDocumentDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(DocumentDto, 'Document deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Document> {
    return this.adminDocumentsService.remove(id);
  }
}
