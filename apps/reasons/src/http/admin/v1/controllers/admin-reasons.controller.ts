import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AdminReasonsService } from '../services/admin-reasons.service';
import { AdminMustCanDo, AllowFor, FindOneByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Reason, ReasonResponseDto, Serialize, UserType } from '@app/common';
import { CreateReasonRequestDto } from '../dtos/create-reason-request.dto';
import { UpdateReasonRequestDto } from '../dtos/update-reason-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REASONS)
@Controller({ path: 'admin/reasons', version: '1' })
export class AdminReasonsController {
  constructor(private readonly adminReasonsService: AdminReasonsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ReasonResponseDto, 'Reason created successfully.')
  @Post()
  create(@Body() createReasonRequestDto: CreateReasonRequestDto): Promise<Reason> {
    return this.adminReasonsService.create(createReasonRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonResponseDto, 'All reasons.')
  @Get()
  findAll(): Promise<Reason[]> {
    return this.adminReasonsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonResponseDto, 'One reason.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reason> {
    return this.adminReasonsService.findOneOrFailById(
      new FindOneByIdPayloadDto<Reason>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ReasonResponseDto, 'Reason updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReasonRequestDto: UpdateReasonRequestDto): Promise<Reason> {
    return this.adminReasonsService.update(id, updateReasonRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReasonResponseDto, 'Reason deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Reason> {
    return this.adminReasonsService.remove(id);
  }
}
