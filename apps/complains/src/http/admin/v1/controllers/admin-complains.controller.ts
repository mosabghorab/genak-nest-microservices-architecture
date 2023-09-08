import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, Complain, ComplainDto, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminComplainsService } from '../services/admin-complains.service';
import { ComplainsPaginationDto } from '../dtos/complains-pagination.dto';
import { FindAllComplainsDto } from '../dtos/find-all-complains.dto';
import { UpdateComplainStatusDto } from '../dtos/update-complain-status.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.COMPLAINS)
@Controller({ path: 'admin/complains', version: '1' })
export class AdminComplainsController {
  constructor(private readonly adminComplainsService: AdminComplainsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ComplainsPaginationDto, 'All complains.')
  @Get()
  findAll(@Query() findAllComplainsDto: FindAllComplainsDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    return this.adminComplainsService.findAll(findAllComplainsDto);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ComplainDto, 'Complain status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@Param('id') id: number, @Body() updateComplainStatusDto: UpdateComplainStatusDto): Promise<Complain> {
    return this.adminComplainsService.updateStatus(id, updateComplainStatusDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ComplainDto, 'Complain deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Complain> {
    return this.adminComplainsService.remove(id);
  }
}
