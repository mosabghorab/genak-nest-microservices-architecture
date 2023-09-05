import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminReasonsService } from '../services/admin-reasons.service';
import {
  AdminMustCanDo,
  AllowFor,
  FindOneByIdDto,
  PermissionAction,
  PermissionGroup,
  PermissionsTarget,
  Reason,
  ReasonDto,
  Serialize,
  UserType,
} from '@app/common';
import { CreateReasonDto } from '../dtos/create-reason.dto';
import { UpdateReasonDto } from '../dtos/update-reason.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.REASONS)
@Controller({ path: 'admin/reasons', version: '1' })
export class AdminReasonsController {
  constructor(private readonly adminReasonsService: AdminReasonsService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(ReasonDto, 'Reason created successfully.')
  @Post()
  create(@Body() createReasonDto: CreateReasonDto): Promise<Reason> {
    return this.adminReasonsService.create(createReasonDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonDto, 'All reasons.')
  @Get()
  findAll(): Promise<Reason[]> {
    return this.adminReasonsService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(ReasonDto, 'One reason.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reason> {
    return this.adminReasonsService.findOneOrFailById(<FindOneByIdDto<Reason>>{
      id,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(ReasonDto, 'Reason updated successfully.')
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateReasonDto: UpdateReasonDto,
  ): Promise<Reason> {
    return this.adminReasonsService.update(id, updateReasonDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(ReasonDto, 'Reason deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Reason> {
    return this.adminReasonsService.remove(id);
  }
}
