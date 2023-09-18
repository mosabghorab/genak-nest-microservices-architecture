import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { AdminMustCanDo, AllowFor, AuthedUser, Complain, ComplainResponseDto, GetAuthedUser, PermissionAction, PermissionGroup, PermissionsTarget, Serialize, UserType } from '@app/common';
import { AdminComplainsService } from '../services/admin-complains.service';
import { AllComplainsResponseDto } from '../dtos/all-complains-response.dto';
import { FindAllComplainsRequestDto } from '../dtos/find-all-complains-request.dto';
import { UpdateComplainStatusRequestDto } from '../dtos/update-complain-status-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.COMPLAINS)
@Controller({ path: 'admin/complains', version: '1' })
export class AdminComplainsController {
  constructor(private readonly adminComplainsService: AdminComplainsService) {}

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(AllComplainsResponseDto, 'All complains.')
  @Get()
  findAll(@Query() findAllComplainsRequestDto: FindAllComplainsRequestDto): Promise<{
    total: number;
    perPage: number;
    lastPage: number;
    data: Complain[];
    currentPage: number;
  }> {
    return this.adminComplainsService.findAll(findAllComplainsRequestDto);
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ComplainResponseDto, 'Complain status updated successfully.')
  @Patch(':id/update-status')
  updateStatus(@GetAuthedUser() authedUser: AuthedUser, @Param('id') id: number, @Body() updateComplainStatusRequestDto: UpdateComplainStatusRequestDto): Promise<Complain> {
    return this.adminComplainsService.updateStatus(authedUser, id, updateComplainStatusRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ComplainResponseDto, 'Complain deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Complain> {
    return this.adminComplainsService.remove(id);
  }
}
