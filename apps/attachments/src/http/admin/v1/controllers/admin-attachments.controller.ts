import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import {
  AdminMustCanDo,
  AllowFor,
  Attachment,
  AttachmentDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Serialize,
  UserType,
} from '@app/common';
import { AdminAttachmentsService } from '../services/admin-attachments.service';
import { UpdateAttachmentStatusDto } from '../dtos/update-attachment-status.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ATTACHMENTS)
@Controller({ path: 'admin/attachments', version: '1' })
export class AdminAttachmentsController {
  constructor(
    private readonly adminAttachmentsService: AdminAttachmentsService,
  ) {}

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(AttachmentDto, 'Attachment status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(
    @Param('id') id: number,
    @Body() updateAttachmentStatusDto: UpdateAttachmentStatusDto,
  ): Promise<Attachment> {
    return this.adminAttachmentsService.updateStatus(
      id,
      updateAttachmentStatusDto,
    );
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(AttachmentDto, 'Attachment deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Attachment> {
    return this.adminAttachmentsService.removeOneById(id);
  }
}
