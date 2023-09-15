import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdPayloadDto, PermissionAction, PermissionGroup, PermissionsTarget, Role, RoleResponseDto, Serialize, UserType } from '@app/common';
import { CreateRoleRequestDto } from '../dtos/create-role-request.dto';
import { UpdateRoleRequestDto } from '../dtos/update-role-request.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ROLES)
@Controller({ path: 'admin/roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(RoleResponseDto, 'Role created successfully.')
  @Post()
  create(@Body() createRoleRequestDto: CreateRoleRequestDto): Promise<Role> {
    return this.rolesService.create(createRoleRequestDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleResponseDto, 'All roles.')
  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleResponseDto, 'One role.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOneOrFailById(
      new FindOneOrFailByIdPayloadDto<Role>({
        id,
      }),
    );
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(RoleResponseDto, 'Role updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleRequestDto: UpdateRoleRequestDto): Promise<Role> {
    return this.rolesService.update(id, updateRoleRequestDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(RoleResponseDto, 'Role deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
