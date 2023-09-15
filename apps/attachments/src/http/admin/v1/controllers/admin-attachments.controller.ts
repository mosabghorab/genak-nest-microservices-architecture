import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, Attachment, AttachmentResponseDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminAttachmentsService } from '../services/admin-attachments.service';
import { UpdateAttachmentStatusRequestDto } from '../dtos/update-attachment-status-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ATTACHMENTS)
@Controller({ path: 'admin/attachments', version: '1' })
export class AdminAttachmentsController {
  constructor(private readonly adminAttachmentsService: AdminAttachmentsService) {}

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AttachmentResponseDto, 'Attachment status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@Param('id') id: number, @Body() updateAttachmentStatusRequestDto: UpdateAttachmentStatusRequestDto): Promise<Attachment> {
    return this.adminAttachmentsService.updateStatus(id, updateAttachmentStatusRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AttachmentResponseDto, 'Attachment deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Attachment> {
    return this.adminAttachmentsService.removeOneById(id);
  }
}
