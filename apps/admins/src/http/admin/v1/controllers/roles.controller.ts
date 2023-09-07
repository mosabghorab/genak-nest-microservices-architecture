import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { AdminMustCanDo, AllowFor, FindOneOrFailByIdDto, PermissionAction, PermissionGroup, PermissionsTarget, Role, RoleDto, Serialize, UserType } from '@app/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@AllowFor(UserType.ADMIN)
@PermissionsTarget(PermissionGroup.ROLES)
@Controller({ path: 'admin/roles', version: '1' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @AdminMustCanDo(PermissionAction.CREATE)
  @Serialize(RoleDto, 'Role created successfully.')
  @Post()
  create(@Body() createAdDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createAdDto);
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'All roles.')
  @Get()
  findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @AdminMustCanDo(PermissionAction.VIEW)
  @Serialize(RoleDto, 'One role.')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Role> {
    return this.rolesService.findOneOrFailById(<FindOneOrFailByIdDto<Role>>{
      id,
    });
  }

  @AdminMustCanDo(PermissionAction.UPDATE)
  @Serialize(RoleDto, 'Role updated successfully.')
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @AdminMustCanDo(PermissionAction.DELETE)
  @Serialize(RoleDto, 'Role deleted successfully.')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Role> {
    return this.rolesService.remove(id);
  }
}
